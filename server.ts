import express from "express";
import { createServer as createViteServer } from "vite";
import cookieParser from "cookie-parser";
import axios from "axios";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Helper for cookie options in AI Studio Iframe
  const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  // SPOTIFY OAUTH
  app.get("/api/auth/spotify/url", (req, res) => {
    const redirectUri = `${req.get("origin") || "https://" + req.get("host")}/auth/spotify/callback`;
    const scopes =
      "user-read-playback-state user-modify-playback-state streaming user-read-currently-playing";

    const params = new URLSearchParams({
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes,
    });

    res.json({
      url: `https://accounts.spotify.com/authorize?${params.toString()}`,
    });
  });

  app.get(
    ["/auth/spotify/callback", "/auth/spotify/callback/"],
    async (req, res) => {
      const { code } = req.query;
      const redirectUri = `${req.protocol}://${req.get("host")}/auth/spotify/callback`;

      try {
        const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          new URLSearchParams({
            grant_type: "authorization_code",
            code: code as string,
            redirect_uri: redirectUri,
            client_id: process.env.SPOTIFY_CLIENT_ID!,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
          }).toString(),
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          },
        );

        res.cookie("spotify_token", response.data.access_token, COOKIE_OPTIONS);

        res.send(`
        <html><body><script>
          if (window.opener) {
            window.opener.postMessage({ type: 'SPOTIFY_AUTH_SUCCESS' }, '*');
            window.close();
          } else { window.location.href = '/'; }
        </script></body></html>
      `);
      } catch (error) {
        console.error("Spotify Auth Error:", error);
        res.status(500).send("Spotify Auth Failed");
      }
    },
  );

  // GOOGLE / YOUTUBE OAUTH
  app.get("/api/auth/google/url", (req, res) => {
    const redirectUri = `${req.get("origin") || "https://" + req.get("host")}/auth/google/callback`;
    const scopes =
      "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube";

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes,
      access_type: "offline",
      prompt: "consent",
    });

    res.json({
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    });
  });

  app.get(
    ["/auth/google/callback", "/auth/google/callback/"],
    async (req, res) => {
      const { code } = req.query;
      const redirectUri = `${req.protocol}://${req.get("host")}/auth/google/callback`;

      try {
        const response = await axios.post(
          "https://oauth2.googleapis.com/token",
          {
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            code,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
          },
        );

        res.cookie("google_token", response.data.access_token, COOKIE_OPTIONS);

        res.send(`
        <html><body><script>
          if (window.opener) {
            window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');
            window.close();
          } else { window.location.href = '/'; }
        </script></body></html>
      `);
      } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).send("Google Auth Failed");
      }
    },
  );

  // Proxy for tokens
  app.get("/api/auth/status", (req, res) => {
    res.json({
      spotify: req.cookies.spotify_token ? true : false,
      google: req.cookies.google_token ? true : false,
      spotify_access_token: req.cookies.spotify_token,
      google_access_token: req.cookies.google_token,
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom", // Change to custom to handle index.html manually
    });
    app.use(vite.middlewares);

    app.use("(.*)", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(
          path.resolve(process.cwd(), "index.html"),
          "utf-8",
        );
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("(.*)", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    } else {
      console.error("Dist folder not found. Please run npm run build.");
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

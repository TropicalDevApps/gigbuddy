import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DecibelMeter } from './DecibelMeter';

describe('DecibelMeter Component', () => {
  it('renders the initial collapsed state correctly', () => {
    render(<DecibelMeter />);
    expect(screen.getByText('Noise')).toBeInTheDocument();
  });

  it('expands when clicked', () => {
    render(<DecibelMeter />);
    const button = screen.getByRole('button', { name: /noise/i });
    
    // It should not show details yet
    expect(screen.queryByText('Decibel Meter')).not.toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(button);
    
    // Now details should be visible
    expect(screen.getByText('Decibel Meter')).toBeInTheDocument();
    expect(screen.getByText(/Health Standards/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Safe/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Dangerous/i).length).toBeGreaterThan(0);
  });
});

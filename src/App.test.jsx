/* eslint-disable no-undef */
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("Gift Card Form", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("renders all input fields", () => {
    expect(screen.getByPlaceholderText(/Dear/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Message/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/From/i)).toBeInTheDocument();
  });

  test("shows error if trying to download without input", () => {
    const downloadButton = screen.getByRole("button", {
      name: /Download Gift Card/i,
    });
    fireEvent.click(downloadButton);
    expect(screen.getByText(/Semua field harus diisi/i)).toBeInTheDocument();
  });

  test("allows typing in input fields", () => {
    const dearInput = screen.getByPlaceholderText(/Dear/i);
    fireEvent.change(dearInput, { target: { value: "Risya" } });
    expect(dearInput.value).toBe("Risya");

    const messageInput = screen.getByPlaceholderText(/Message/i);
    fireEvent.change(messageInput, {
      target: { value: "Selamat ulang tahun!" },
    });
    expect(messageInput.value).toBe("Selamat ulang tahun!");

    const fromInput = screen.getByPlaceholderText(/From/i);
    fireEvent.change(fromInput, { target: { value: "Romi" } });
    expect(fromInput.value).toBe("Romi");
  });

  test("renders dropzone text", () => {
    expect(screen.getByText(/Browse File/i)).toBeInTheDocument();
    expect(screen.getByText(/Drag & Drop File Here/i)).toBeInTheDocument();
  });
});

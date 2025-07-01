"use client";

import React from "react";
import Header from "../components/Header";

export default function ManualPage() {
  return (
    <>
      <Header />
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Manual de Usuario</h1>
          <div className="flex justify-center">
            <iframe
              src="https://drive.google.com/file/d/14Y9uqkOoIqTXFnuGFESeihr7xY1S7lD2/preview"
              width="100%"
              height="800px"
              allow="autoplay"
              className="rounded border shadow"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}

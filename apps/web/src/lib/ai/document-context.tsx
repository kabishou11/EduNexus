"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { KBDocument } from "@/lib/client/kb-storage";

interface DocumentContextType {
  currentDocument: KBDocument | null;
  setCurrentDocument: (doc: KBDocument | null) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [currentDocument, setCurrentDocument] = useState<KBDocument | null>(null);

  return (
    <DocumentContext.Provider value={{ currentDocument, setCurrentDocument }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocument() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error("useDocument must be used within a DocumentProvider");
  }
  return context;
}

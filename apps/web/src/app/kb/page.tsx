"use client";

import { useState, useEffect, useCallback } from "react";
import { KBLayout } from "@/components/kb/kb-layout";
import { useDocument } from "@/lib/ai/document-context";
import { requestJson } from "@/lib/client/api";
import type { KBDocument, KBVault } from "@/lib/client/kb-storage";

type ServerKBDocument = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt?: string;
  vaultId?: string;
};

type KbDocsResponse = {
  docs: ServerKBDocument[];
};

type KbDocResponse = {
  doc: ServerKBDocument;
};

const DEFAULT_VAULT: KBVault = {
  id: "default",
  name: "我的知识库",
  path: "/default",
  createdAt: new Date(0),
  lastAccessedAt: new Date(),
  isDefault: true,
};

function toClientDoc(doc: ServerKBDocument, fallbackVaultId: string): KBDocument {
  const updatedAt = doc.updatedAt ? new Date(doc.updatedAt) : new Date();
  return {
    id: doc.id,
    title: doc.title,
    content: doc.content,
    tags: doc.tags ?? [],
    createdAt: updatedAt,
    updatedAt,
    vaultId: doc.vaultId ?? fallbackVaultId,
    version: 1,
  };
}

export default function KnowledgeBasePage() {
  const { setCurrentDocument } = useDocument();
  const [vaults, setVaults] = useState<KBVault[]>([DEFAULT_VAULT]);
  const [currentVault, setCurrentVault] = useState<KBVault | null>(DEFAULT_VAULT);
  const [documents, setDocuments] = useState<KBDocument[]>([]);
  const [currentDoc, setCurrentDoc] = useState<KBDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentDocument(currentDoc);
  }, [currentDoc, setCurrentDocument]);

  const loadDocuments = useCallback(async (vaultId: string) => {
    const data = await requestJson<KbDocsResponse>(`/api/kb/docs?vaultId=${encodeURIComponent(vaultId)}`);
    return data.docs.map((doc) => toClientDoc(doc, vaultId));
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const docs = await loadDocuments(DEFAULT_VAULT.id);
        setDocuments(docs);
      } catch (error) {
        console.error("Failed to initialize knowledge base:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [loadDocuments]);

  const handleVaultChange = async (vaultId: string) => {
    const vault = vaults.find((v) => v.id === vaultId) || DEFAULT_VAULT;
    setCurrentVault(vault);

    const docs = await loadDocuments(vault.id);
    setDocuments(docs);
    setCurrentDoc(null);
  };

  const handleCreateDocument = async (title: string) => {
    if (!currentVault) return;

    const data = await requestJson<KbDocResponse>("/api/kb/docs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, vaultId: currentVault.id }),
    });

    const newDoc = toClientDoc(data.doc, currentVault.id);
    setDocuments((prev) => [newDoc, ...prev]);
    setCurrentDoc(newDoc);
  };

  const handleUpdateDocument = async (doc: KBDocument) => {
    const data = await requestJson<KbDocResponse>(`/api/kb/doc/${encodeURIComponent(doc.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: doc.title,
        content: doc.content,
        tags: doc.tags,
      }),
    });

    const updatedDoc = toClientDoc(data.doc, doc.vaultId);
    setDocuments((prev) => prev.map((item) => (item.id === updatedDoc.id ? updatedDoc : item)));
    setCurrentDoc(updatedDoc);
  };

  const handleDeleteDocument = async (docId: string) => {
    await requestJson(`/api/kb/doc/${encodeURIComponent(docId)}`, {
      method: "DELETE",
    });

    setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
    if (currentDoc?.id === docId) {
      setCurrentDoc(null);
    }
  };

  const handleSelectDocument = (doc: KBDocument) => {
    setCurrentDoc(doc);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载知识库...</p>
        </div>
      </div>
    );
  }

  return (
    <KBLayout
      vaults={vaults}
      currentVault={currentVault}
      documents={documents}
      currentDoc={currentDoc}
      onVaultChange={handleVaultChange}
      onCreateDocument={handleCreateDocument}
      onUpdateDocument={handleUpdateDocument}
      onDeleteDocument={handleDeleteDocument}
      onSelectDocument={handleSelectDocument}
    />
  );
}

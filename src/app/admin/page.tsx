"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar/NavBar";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogoutButton from "@/app/api/LogoutButton"

const AdminUploadPage = () => {
  const [form, setForm] = useState({
    title: "",
    date: "",
    tags: "",
    imageUrl: "",
    duration: "",
    participants: "",
    spotifyUrl: "",
    youtubeUrl: "",
    amazonUrl: "",
    deezerUrl: "",
    soundcloudUrl: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");

  const CLOUD_NAME = "dgrap26b6";
  const UPLOAD_PRESET = "podcast_uploads";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Debug: Mostra os valores atuais no console
    console.log("Valores do formulário:", form);
  
    // Verificação simplificada dos campos obrigatórios
    const requiredFieldsValid = (
      (form.title || "").trim() !== "" &&
      (form.participants || "").trim() !== "" &&
      (form.duration || "").trim() !== "" &&
      (form.date || "").trim() !== "" &&
      (form.tags || "").trim() !== "" &&
      (form.imageUrl || "").trim() !== ""
    );
  
    // Verificação simplificada dos links
    const atLeastOneLink = (
      form.spotifyUrl.trim() !== "" ||
      form.youtubeUrl.trim() !== "" ||
      form.amazonUrl.trim() !== "" ||
      form.deezerUrl.trim() !== "" ||
      form.soundcloudUrl.trim() !== ""
    );
  
    if (!requiredFieldsValid || !atLeastOneLink) {
      setErrorMessage(
        `Por favor, preencha todos os campos obrigatórios e forneça ao menos um link.
        Campos atuais:
        Título: ${form.title}
        Participantes: ${form.participants}
        Duração: ${form.duration}
        Data: ${form.date}
        Tags: ${form.tags}
        Imagem: ${form.imageUrl ? "Preenchida" : "Vazia"}
        Links: ${atLeastOneLink ? "Preenchidos" : "Nenhum"}`
      );
      return;
    }
  
    setErrorMessage("");
    console.log("Enviando dados:", form);
    
    try {
      const response = await fetch("/api/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map(tag => tag.trim()) // Converte tags para array
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Sucesso:", result);
      alert("Episódio publicado com sucesso!");
      
      // Limpa o formulário após sucesso
      setForm({
        title: "",
        date: "",
        tags: "",
        imageUrl: "",
        duration: "",
        participants: "",
        spotifyUrl: "",
        youtubeUrl: "",
        amazonUrl: "",
        deezerUrl: "",
        soundcloudUrl: "",
      });
      setSelectedImageName("");
  
    } catch (error) {
      console.error("Erro ao publicar:", error);
      setErrorMessage("Erro ao publicar episódio. Verifique o console para detalhes.");
    }
  };

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  return (
    <ProtectedRoute>
      <>
        <NavBar />
        
        
        <main className="bg-pink-50 min-h-screen py-12 px-6 sm:px-0">
          <section className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-pink-100">
            <h1 className="text-2xl font-bold text-gray-700 mb-6">
              Adicionar Novo Episódio
            </h1>

            {errorMessage && (
              <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mb-4 text-sm font-medium">
                {errorMessage}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 text-sm text-gray-700"
            >
              <div>
                <label className="font-medium">Título *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border border-pink-200 rounded-xl p-2 mt-1"
                  required
                />
              </div>

              <div>
                <label className="font-medium">Participantes *</label>
                <input
                  type="text"
                  name="participants"
                  placeholder="Ex: Monize, Rafael e Stefany"
                  value={form.participants}
                  onChange={handleChange}
                  className="w-full border border-pink-200 rounded-xl p-2 mt-1"
                />
              </div>

              <div>
                <label className="font-medium">Duração *</label>
                <input
                  type="time"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  className="w-full border border-pink-200 rounded-xl p-2 mt-1"
                  step="60"
                />
              </div>

              <div>
                <label className="font-medium">Data *</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full border border-pink-200 rounded-xl p-2 mt-1"
                />
              </div>

              <div>
                <label className="font-medium">
                  Tags (separadas por vírgula) *
                </label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  className="w-full border border-pink-200 rounded-xl p-2 mt-1"
                />
              </div>

              <div>
                <label className="font-medium block mb-2">
                  Imagem do Episódio *
                </label>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="w-full sm:w-1/2">
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("uploadInput")?.click()
                      }
                      className="w-full bg-pink-100 text-pink-700 font-medium py-2 px-4 rounded-xl border border-pink-300 hover:bg-pink-200 transition"
                    >
                      {form.imageUrl ? "Trocar Imagem" : "Escolher Imagem"}
                    </button>

                    <input
                      id="uploadInput"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("upload_preset", UPLOAD_PRESET);

                        try {
                          const res = await fetch(
                            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                            {
                              method: "POST",
                              body: formData,
                            }
                          );

                          const data = await res.json();
                          setForm((prev) => ({
                            ...prev,
                            imageUrl: data.secure_url,
                          }));
                          setSelectedImageName(file.name);
                        } catch (error) {
                          console.error("Erro no upload da imagem:", error);
                        }
                      }}
                      className="hidden"
                    />

                    {selectedImageName && (
                      <div className="mt-2 text-sm text-gray-600 italic">
                        Imagem selecionada: {selectedImageName}
                      </div>
                    )}

                    {form.imageUrl && (
                      <div className="mt-2 text-sm text-green-600 font-medium">
                        ✅ Imagem carregada com sucesso!
                      </div>
                    )}
                  </div>

                  {form.imageUrl && (
                    <div className="relative w-full sm:w-1/2 h-40 rounded-xl border border-pink-200 bg-pink-50 overflow-hidden group">
                      <Image
                        src={form.imageUrl}
                        alt="Preview"
                        layout="fill"
                        objectFit="contain"
                        className="transition duration-200 group-hover:opacity-90"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, imageUrl: "" }));
                          setSelectedImageName("");
                        }}
                        className="absolute top-2 right-2 bg-white bg-opacity-80 text-red-600 border border-red-200 px-2 py-1 text-xs rounded-lg hover:bg-red-100"
                      >
                        Remover
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-medium">Spotify</label>
                  <input
                    type="text"
                    name="spotifyUrl"
                    value={form.spotifyUrl}
                    onChange={handleChange}
                    className="w-full border border-pink-200 rounded-xl p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="font-medium">YouTube</label>
                  <input
                    type="text"
                    name="youtubeUrl"
                    value={form.youtubeUrl}
                    onChange={handleChange}
                    className="w-full border border-pink-200 rounded-xl p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="font-medium">Amazon Music</label>
                  <input
                    type="text"
                    name="amazonUrl"
                    value={form.amazonUrl}
                    onChange={handleChange}
                    className="w-full border border-pink-200 rounded-xl p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="font-medium">Deezer</label>
                  <input
                    type="text"
                    name="deezerUrl"
                    value={form.deezerUrl}
                    onChange={handleChange}
                    className="w-full border border-pink-200 rounded-xl p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="font-medium">SoundCloud</label>
                  <input
                    type="text"
                    name="soundcloudUrl"
                    value={form.soundcloudUrl}
                    onChange={handleChange}
                    className="w-full border border-pink-200 rounded-xl p-2 mt-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-pink-600 text-white font-medium py-2 px-4 rounded-xl mt-4 hover:bg-pink-700 transition"
              >
                Publicar Episódio
              </button>
            </form>
          </section>
          <div className="flex justify-center  pt-5">
            <LogoutButton />
          </div>
        </main>
      </>
    </ProtectedRoute>
    
  );
};

export default AdminUploadPage;

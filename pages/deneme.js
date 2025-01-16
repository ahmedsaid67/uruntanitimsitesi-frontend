import React, { useState } from "react";
import axios from "axios";

const Deneme = () => {
  const [urunKategori, setUrunKategori] = useState("");
  const [vitrinKategori, setVitrinKategori] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    const url = "http://127.0.0.1:8000/api/myapp/urunler/9/";

    const formData = new FormData();

    const urun_kategori= 3
    const aciklama = "<p>güzell.</p>"
    const bedenler = [
      {id: 73, numara: 30, durum: false},
      {id: 74, numara: 32, durum: false},
      {id: 75, numara: 34, durum: false},
      {id: 76, numara: 36, durum: true},
      {id: 77, numara: 38, durum: true},
      {id: 78, numara: 40, durum: true},
      {id: 79, numara: 42, durum: true},
      {id: 80, numara: 44, durum: true},
      {id: 81, numara: 46, durum: true}
    ]

    formData.append("urun_kategori",urun_kategori)

    formData.append("aciklama",aciklama)

    formData.append("bedenler", JSON.stringify(bedenler));


    try {
      const response = await axios.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Dosya ve JSON verisi göndermek için
        },
      });
      setMessage("Güncelleme başarılı!");
      console.log("Response:", response.data);
    } catch (error) {
      setMessage("Bir hata oluştu!");
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Ürün Güncelleme</h1>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Ürün Kategori ID:{" "}
          <input
            type="number"
            value={urunKategori}
            onChange={(e) => setUrunKategori(e.target.value)}
            placeholder="Kategori ID"
          />
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Vitrin Kategori ID:{" "}
          <input
            type="number"
            value={vitrinKategori}
            onChange={(e) => setVitrinKategori(e.target.value)}
            placeholder="Vitrin ID"
          />
        </label>
      </div>
      <button onClick={handleUpdate} style={{ padding: "10px 20px" }}>
        Güncelle
      </button>
      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
};

export default Deneme;

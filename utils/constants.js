export const API_SERVER_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;


export const API_ROUTES = {


    TOKEN: API_SERVER_URL + "/token/",
    LOGOUT: API_SERVER_URL + "/logout/",
    CHECK_TOKEN : API_SERVER_URL + "/check-token/",
    USER_INFO : API_SERVER_URL + "/user-info/",


    // SLİDERS

    SLIDERS: API_SERVER_URL + "/sliders/",
    SLIDERS_ACTIVE_MASAUSTU : API_SERVER_URL + "/sliders/get_active_masaustu/",
    SLIDERS_ACTIVE_MOBILE : API_SERVER_URL + "/sliders/get_active_mobil/",
    SLIDERS_PAGINATIONS : API_SERVER_URL + "/sliders/?page=currentPage",
    SLIDERS_DETAIL : API_SERVER_URL + "/sliders/detay_id/",
    SLIDERS_DELETE : API_SERVER_URL + "/sliders/bulk_soft_delete/",


    // ÜRÜNLER
    URUN_KATEGORI : API_SERVER_URL + "/urunkategori/",
    URUN_KATEGORI_ACTIVE : API_SERVER_URL + "/urunkategori/get_active/",
    URUN_KATEGORI_LIST : API_SERVER_URL + "/urunkategori-list/",
    URUN_KATEGORI_PAGINATIONS : API_SERVER_URL + "/urunkategori/?page=currentPage",  // üstteki api ile aynı servistir, sadece mevcutta olan paginations yapısını kullanımı için hazır hale getirilmiştir. -- KULLANIM ÖRENEĞİ ---> const response = await axios.get(API_ROUTES.PERSONEL_TURU_PAGINATIONS.replace("currentPage",currentPage))
    URUN_KATEGORI_DETAIL : API_SERVER_URL + "/urunkategori/id/",
    URUN_KATEGORI_DELETE : API_SERVER_URL + "/urunkategori/bulk_soft_delete/",

    URUN_VITRIN : API_SERVER_URL + "/urunvitrin/",
    URUN_VITRIN_ACTIVE : API_SERVER_URL + "/urunvitrin/get_active/",
    URUN_VITRIN_LIST : API_SERVER_URL + "/urunvitrin-list/",
    URUN_VITRIN_PAGINATIONS : API_SERVER_URL + "/urunvitrin/?page=currentPage",  // üstteki api ile aynı servistir, sadece mevcutta olan paginations yapısını kullanımı için hazır hale getirilmiştir. -- KULLANIM ÖRENEĞİ ---> const response = await axios.get(API_ROUTES.PERSONEL_TURU_PAGINATIONS.replace("currentPage",currentPage))
    URUN_VITRIN_DETAIL : API_SERVER_URL + "/urunvitrin/id/",
    URUN_VITRIN_DELETE : API_SERVER_URL + "/urunvitrin/bulk_soft_delete/",

    URUNLER : API_SERVER_URL + "/urunler/",
    URUNLER_ACTIVE : API_SERVER_URL + "/urunler/get_active/",
    URUNLER_ACTIVE_FULL : API_SERVER_URL + "/urunler/active-full/",
    URUNLER_LIST : API_SERVER_URL + "/urunler-list/",
    URUNLER_PAGINATIONS : API_SERVER_URL + "/urunler/?page=currentPage",
    URUNLER_DETAIL : API_SERVER_URL + "/urunler/id/",
    URUNLER_DELETE : API_SERVER_URL + "/urunler/bulk_soft_delete/",

    URUNLER_DETAIL_PURE : API_SERVER_URL + "/urunler/urun-detail/?slug=urunSlug" ,

    URUNLER_KATEGORI_FILTER : API_SERVER_URL + `/urunler/?kategori=seciliKategori&page=currentPage`,
    URUNLER_KATEGORI_FILTER_PAGINATIONSUZ : API_SERVER_URL + `/urunler/?kategori=seciliKategori`,

    URUNLER_VITRIN_KATEGORI_FILTER : API_SERVER_URL + `/urunler/?vitrin_kategori=seciliKategori&page=currentPage`,
    URUNLER_VITRIN_KATEGORI_FILTER_PAGINATIONSUZ : API_SERVER_URL + `/urunler/?vitrin_kategori=seciliKategori`,

    // ALBÜM İMAGES

    ALBUM_IMAGES : API_SERVER_URL + "/image/",
    ALBUM_IMAGES_DELETE : API_SERVER_URL + "/image/bulk_soft_delete/",
    ALBUM_IMAGES_KATEGORI_FILTER : API_SERVER_URL + `/image/?kategori=seciliKategori`,


    // MEDYA

    MEDYA_DETAIL: API_SERVER_URL + "/medya/1/",
    
    // REFERANSLAR

    REFERENCES: API_SERVER_URL + "/references/",
    REFERENCES_ACTIVE : API_SERVER_URL + "/references/get_active/?page=currentPage",
    REFERENCES_PAGINATIONS : API_SERVER_URL + "/references/?page=currentPage",
    REFERENCES_DETAIL : API_SERVER_URL + "/references/id/",
    REFERENCES_DELETE : API_SERVER_URL + "/references/bulk_soft_delete/",


    // HIZLI LİNKLER

    HIZLI_LINKLER: API_SERVER_URL + "/hizlilinkler/",
    HIZLI_LINKLER_ACTIVE : API_SERVER_URL + "/hizlilinkler/get_active/",
    HIZLI_LINKLER_PAGINATIONS : API_SERVER_URL + "/hizlilinkler/?page=currentPage",
    HIZLI_LINKLER_DETAIL : API_SERVER_URL + "/hizlilinkler/id/",
    HIZLI_LINKLER_DELETE : API_SERVER_URL + "/hizlilinkler/bulk_soft_delete/",

    // İLETİŞİM

    ILETISIM : API_SERVER_URL + "/contact/id/",

    // HAKKIMIZDA
    
    HAKKIMIZDA : API_SERVER_URL + "/hakkimizda/id/",


    // ADET

    ADET: API_SERVER_URL + "/adet/",


    // BEDENLER

    URUNE_AIT_BEDENLER : API_SERVER_URL + "/bedenler/urun/id/",
    URUNE_AIT_BEDEN_GUNCELLEME : API_SERVER_URL + "/bedenler/urun/id/update-durum/",
    URUNE_AIT_BEDEN_EKLEME : API_SERVER_URL + "/bedenler/urun/id/create/",


    // ÖZELLIKLER

    URUNE_AIT_OZELLIKLER : API_SERVER_URL + "/ozellikler/urun/id/",
    URUNE_AIT_OZELLIK_GUNCELLEME : API_SERVER_URL + "/ozellikler/urun/id/update-durum/",
    URUNE_AIT_OZELLIK_EKLEME : API_SERVER_URL + "/ozellikler/urun/id/create/",


    // MESSAGE

    MESSAGE: API_SERVER_URL + "/message/",
    MESSAGE_PAGINATIONS : API_SERVER_URL + "/message/?page=currentPage",
    MESSAGE_DETAIL : API_SERVER_URL + "/message/id/",
    MESSAGE_DELETE : API_SERVER_URL + "/message/bulk_soft_delete/",

}
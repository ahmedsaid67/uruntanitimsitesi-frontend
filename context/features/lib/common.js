import { deleteCookie, getCookie, setCookie } from "cookies-next";


export function storeTokenInCookie(token) {
    setCookie("token", token, {
      httpOnly: process.env.PRODUCTION,  //sunucuya geçince burayı true yapmak guvenlık acıdan  gereklı... process.env.PRODUCTION şuan env de bu yok ya false kabul goruluyor yanı yanıt aslında false canlıya gecınce true olmalı
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      secure: true,
    });
  }
  
  export function getTokenFromCookie() {
    // return localStorage.getItem("token");
    return getCookie("token");
  }
  
  export function deleteTokenFromCookie() {
    // return localStorage.getItem("token");
    deleteCookie("token");
  }


  //httpOnly özelliğini process.env.PRODUCTION ile ayarladığınızda, bu ayar true veya false olabilir. httpOnly çerezi tarayıcı tarafından okunamaz hale getirir, bu nedenle sadece sunucu tarafından erişilebilir. Bu nedenle, httpOnly özelliğini yalnızca üretim (production) ortamında true yapmak, güvenlik açısından daha iyidir.

//Eğer process.env.PRODUCTION true ise, httpOnly özelliği true olarak ayarlanacak ve çerez tarayıcı tarafından okunamaz hale gelecektir. Bu, çerezi kötü niyetli kodların veya tarayıcı üzerinden erişmek isteyenlerin korumasına yardımcı olabilir. Ancak, geliştirme sırasında httpOnly özelliğini false yaparak çerezin tarayıcı tarafından okunabilir olmasını sağlayabilirsiniz, bu da hata ayıklamayı kolaylaştırabilir.

//Bu nedenle, httpOnly ayarını process.env.PRODUCTION ile kontrol etmek, üretim ve geliştirme ortamlarına göre çerez ayarlarını daha iyi yönetmenizi sağlar.




// güzel açıklayıcı bir not


//Elbette, storeTokenInCookie fonksiyonunun parametrelerini ve işlevselliğini açıklayayım. Bu fonksiyon, bir kullanıcı token'ını bir HTTP çerezi (cookie) içinde saklamak için kullanılıyor. İşte parametreler ve her birinin anlamı:

//token: Bu, saklamak istediğiniz kullanıcı token'ıdır. Genellikle, kullanıcı sisteme giriş yaptıktan sonra sunucudan alınan kimlik doğrulama token'ıdır.

//setCookie("token", token, {...}): Bu, setCookie fonksiyonunu çağırır. setCookie fonksiyonu, belirtilen token'ı bir çerez içinde saklar. İlk argüman "token" çerezin adıdır, ikinci argüman ise saklanacak token değeridir.

//httpOnly: process.env.PRODUCTION: httpOnly seçeneği, çerezin yalnızca HTTP üzerinden erişilebilir olmasını sağlar ve JavaScript gibi client-side scriptlerin bu çereze erişimini engeller. Bu, çerezin XSS (Cross-Site Scripting) saldırılarına karşı korunmasına yardımcı olur. process.env.PRODUCTION değeri, çerezin yalnızca üretim ortamında httpOnly olmasını sağlar. Geliştirme aşamasında bu özelliğin devre dışı bırakılması için kullanılır.

//maxAge: 7 * 24 * 60 * 60: Bu, çerezin ne kadar süreyle geçerli olacağını belirtir. Burada 7 * 24 * 60 * 60 saniye olarak hesaplanmıştır, yani çerez 7 gün boyunca geçerlidir.

//path: "/": Bu, çerezin hangi yolda (path) geçerli olacağını belirtir. "/" değeri, çerezin tüm yollar için geçerli olduğunu gösterir.

//secure: true: Bu seçenek, çerezin yalnızca HTTPS üzerinden gönderilmesini sağlar. Bu, çerezin ağ üzerinden gönderilirken şifrelenmesini ve güvenliğinin artırılmasını sağlar.

//Bu fonksiyon, özellikle web tabanlı uygulamalarda kullanıcı kimlik doğrulama token'larını güvenli bir şekilde saklamak için yaygın bir yöntemdir. httpOnly ve secure seçenekleri, güvenlik açısından önemlidir ve çerezlerin güvenli bir şekilde kullanılmasını sağlar.
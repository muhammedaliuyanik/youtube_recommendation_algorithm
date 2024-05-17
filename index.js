// Gerekli modülleri yüklüyoruz
const { subscribe } = require('diagnostics_channel');
const fs = require('fs'); // Dosya sistemi modülü
const _ = require('lodash'); // Lodash kütüphanesi, JavaScript'te veri işlemleri için yaygın olarak kullanılır

// Sahte kullanıcı oluşturuyoruz
const mockUser = {
    userId: "001d72b3-4d2a-4160-ab5c-87ad844b1423",
    category: ["d52e9f3a-5867-4952-8821-4fb816e6f0dd", "e23aa129-ade2-4363-8704-e0aacafb1c9d"], // Kullanıcının ilgi alanları kategoriler
};

// Ağırlıklar oluşturuyoruz, bu ağırlıklar farklı kullanıcı etkileşimlerini puanlamak için kullanılır
const weights = {
    watchPercentage: 10, // İzleme yüzdesi
    ignored: -3,         // Göz ardı edilen
    liked: 9,            // Beğenilen
    disliked: -9,        // Beğenilmeyen
    shared: 5,           // Paylaşılan
    subscribed: 10,      // Abone olunan
    skipped: -3,         // Atlanan
};

// Sonuçları filtrelemek için bir fonksiyon
const filterPersonalizaton = (category) => {
    return new Promise((resolve, reject) => {
        // viewerPersonalization.json dosyasını okuyoruz
        fs.readFile('./data/viewerPersonalization.json', 'utf-8', (err, data) => {
            if (err) reject(Error(err)); // Hata varsa reddediyoruz
            let allfilterPersonalizaton = JSON.parse(data); // Veriyi JSON formatına çeviriyoruz
            // Kategorilere göre filtreliyoruz
            let filteredData = allfilterPersonalizaton.filter((viewerPersonalization) => category.includes(viewerPersonalization.category));
            resolve(filteredData); // Filtrelenmiş veriyi döndürüyoruz
        });
    });
};

// İlk 10 videoyu getiren fonksiyon
const getTopTenVideos = (data) => {
    return _.chain(data)
        .map((item) => [item.videoId, calculateWeight(item)]) // Her öğe için videoId ve ağırlık hesaplıyoruz
        .groupBy((item) => item[0]) // VideoId'ye göre grupluyoruz
        .map((items) => {
            const totalWeights = _.sumBy(items, (item) => item[1]); // Toplam ağırlıkları hesaplıyoruz
            const avgWeight = totalWeights / items.length; // Ortalama ağırlığı hesaplıyoruz
            return { id: items[0][0], score: avgWeight }; // VideoId ve ortalama puanı döndürüyoruz
        })
        .sortBy('score') // Puanlara göre sıralıyoruz
        .reverse() // Sıralamayı ters çeviriyoruz (yüksekten düşüğe)
        .take(10) // İlk 10 sonucu alıyoruz
        .value(); // Sonucu döndürüyoruz
};

// Ağırlık hesaplama fonksiyonu
const maxWeight = Math.max(...Object.values(weights)); // Ağırlıkların en büyük değerini alıyoruz

const calculateWeight = (userData) => {
    const { watchPercentage, ignored, liked, disliked, shared, subscribed, skipped } = userData;
    const weight = (watchPercentage > 0 ? (weights.watchPercentage / watchPercentage) : 0) +
        (ignored ? weights.ignored / maxWeight : 0) +
        (liked ? weights.liked / maxWeight : 0) +
        (disliked ? weights.disliked / maxWeight : 0) +
        (shared ? weights.shared / maxWeight : 0) +
        (subscribed ? weights.subscribed / maxWeight : 0) +
        (skipped ? weights.skipped / maxWeight : 0);
    return (weight / (weights.watchPercentage + weights.ignored + weights.liked + weights.disliked + weights.shared + weights.subscribed + weights.skipped)) * 100;
    // Yukarıdaki hesaplama, verilen kullanıcı verilerine göre ağırlığı hesaplar ve normalize eder
};

// Başlatma fonksiyonu
const init = async () => {
    const filteredData = await filterPersonalizaton(mockUser.category); // Kullanıcının kategorilerine göre veriyi filtreliyoruz
    console.log(getTopTenVideos(filteredData)); // İlk 10 videoyu yazdırıyoruz
};

init(); // Başlatma fonksiyonunu çağırıyoruz

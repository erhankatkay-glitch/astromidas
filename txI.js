/* Burçlara özel günlük yorumlar: güneş burcu esaslı "solar ev" tekniği.
   Ay'ın burca göre bulunduğu ev (1–12) günün ana temasını, Venüs'ün evi aşk tonunu verir; günün gerçek açıları ve retrolar eklenir. */
var TX = (typeof TX !== 'undefined') ? TX : {};
TX.BURC = {
  // Ay'ın burca göre evi → aşk ve ilişkiler
  LOVE: [
    'Ay burcunda: duyguların yüzünde, çekiciliğin yüksek. İlk adımı atmak ya da hislerini açıkça söylemek için güçlü bir gün.',
    'Sevgiyi somut jestlerle göstermek istiyorsun: güzel bir yemek, küçük bir hediye ya da sadece yanında olmak.',
    'Hafif sohbetler ve tatlı mesajlar gönül bağını güçlendiriyor. Bekarsan yakın çevrende biri dikkatini çekebilir.',
    'Yuva ve aile öncelikte. Partnerinle evde sakin bir akşam, dışarıdaki her şeyden daha değerli olabilir.',
    'Flört, romantizm ve eğlence enerjisi yüksek! Kalbinin sesini dinle, kendini şımartmaktan çekinme.',
    'Aşkta küçük ayrıntılar önemli: birine pratik bir iyilik yapmak, büyük sözlerden daha çok şey anlatır.',
    'İlişkiler tam merkezde. Partnerinle ortak kararlar almak ya da bekarsan biriyle tanışmak için uygun bir gün.',
    'Duygusal derinlik ve tutku artıyor. Yüzeysel sohbetler yetmeyebilir; içten bir yakınlık arıyorsun.',
    'Birlikte yeni bir şey keşfetmek ilişkiye canlılık getirir: bir gezi planı, bir film ya da derin bir sohbet.',
    'Kariyer meşguliyeti ilişkini gölgeleyebilir. Sevdiğine kısa da olsa ayırdığın bir an çok değerli olacak.',
    'Arkadaşlık temelli sevgi öne çıkıyor. Bir dost sohbeti ya da grup buluşması gönlüne iyi gelecek.',
    'Gizli duygular ve hayaller canlanıyor. Kendine iç sesini dinleyecek bir alan aç; aşkta sezgilerin doğru söylüyor.'
  ],
  // Ay'ın evi → para ve kariyer
  MONEY: [
    'Kendini öne çıkarmak için iyi bir gün: fikirlerini savun, inisiyatif al ve görünür ol.',
    'Para ve kaynaklar gündemde. Bütçeni gözden geçir; duygusal alışverişlerden kaçın.',
    'İletişim kazandırıyor: e-postalar, görüşmeler, kısa iş bağlantıları ve sözleşme hazırlıkları için verimli.',
    'Evden çalışma, gayrimenkul ya da aile işleri öne çıkıyor. Temelleri sağlamlaştır.',
    'Yaratıcı projelerin ve hobilerin para potansiyeli var. Eğlenerek yaptığın işte parlıyorsun.',
    'Verimlilik günü: yapılacaklar listeni bitir, düzen kur, ayrıntıları gözden kaçırma.',
    'Ortaklıklar ve müşteri ilişkileri belirleyici. Pazarlık ve anlaşmalarda karşı tarafı dinle.',
    'Ortak paralar, borçlar, vergiler ya da yatırımlar gündemde. Gizli maliyetlere dikkat et.',
    'Eğitim, yayın, yurt dışı ya da büyük resim projeleri destekleniyor. Vizyonunu genişlet.',
    'Kariyer ve itibar öne çıkıyor. Yöneticilerle görüşmek ya da hedef koymak için güçlü bir gün.',
    'Ağ kurmak kazandırıyor. Bir bağlantı ya da ekip çalışması yeni kapılar açabilir.',
    'Perde arkası işler için uygun: planlama, araştırma ve yarım kalanları sessizce tamamlama.'
  ],
  // Ay'ın evi → ruh hali ve enerji
  MOOD: [
    'Enerjin yüksek, ruh halin değişken. Bedenini hareket ettir; duygularını bastırmak yerine ifade et.',
    'Sakinlik ve güven arıyorsun. Konfor alanında biraz kalmak sana iyi gelecek.',
    'Zihnin hareketli ve meraklı. Kısa bir yürüyüş ya da sohbet kafanı tazeler.',
    'Duygusal ve içe dönük bir gün. Geçmişten anılar canlanabilir; kendine şefkatle yaklaş.',
    'Neşeli ve yaratıcı bir enerji. İçindeki çocuğa oyun alanı aç.',
    'Biraz kaygılı ya da titiz olabilirsin. Beden bakımı ve düzenli bir rutin dengeni sağlar.',
    'Başkalarına uyum sağlamaya odaklısın. Kendi ihtiyaçlarını unutmamaya dikkat et.',
    'Yoğun ve derin duygular. Yalnız kalıp duygularını işlemek, gücünü geri kazandırır.',
    'İyimser ve maceraperest bir ruh hali. Yeni bir şey öğrenmek ruhunu açar.',
    'Ciddi ve sorumluluk odaklı bir gün. Kendine katı davranmadan disiplinini koru.',
    'Sosyal ve fikir dolu bir enerji. İnsanlarla bağlantı kurmak moralini yükseltir.',
    'Enerjin düşük olabilir; dinlenme ve uyku öncelikli. Sezgilerin ise çok güçlü.'
  ],
  // Ay'ın evi → dikkat edilmesi gereken konu
  CARE: [
    'Aceleci tepkiler ve sabırsızlık. Konuşmadan önce bir nefes al.',
    'Duygusal harcamalar ve inatlaşma. “İhtiyacım var mı?” diye sor.',
    'Dikkat dağınıklığı ve yanlış anlaşılmalar. Mesajlarını göndermeden önce bir kez daha oku.',
    'Alınganlık ve aile içi gerginlikler. Geçmişi bugüne taşıma.',
    'Gurur ve savurganlık. Eğlenceyi abartıp bütçeyi ya da sağlığı zorlamaktan kaçın.',
    'Aşırı eleştiri ve kaygı. Kendine ve başkalarına daha yumuşak ol.',
    'Başkalarını memnun etmek için kendinden vazgeçme. Sınırlarını hatırla.',
    'Kıskançlık, şüphe ve kontrol isteği. Güven duygunu içeriden besle.',
    'Abartılı vaatler ve dağınık planlar. Söz vermeden önce gerçekçi ol.',
    'İşkoliklik ve katılık. Duygularını ve dinlenme ihtiyacını görmezden gelme.',
    'Mesafelilik ya da ani kopuşlar. Duygularını zihninle bastırma.',
    'Kaçış eğilimi ve yorgunluk. Önemli kararları ertele, sınırlarını koru.'
  ],
  // Ay'ın evi → günün fırsatı
  OPP: [
    'Yeni bir başlangıç yapmak, imajını tazelemek ya da kendin için cesur bir adım atmak.',
    'Gelirini artıracak bir fikir ya da değerini bilen bir pazarlık.',
    'Önemli bir mesaj, görüşme ya da öğrenme fırsatı; doğru soruyu sor.',
    'Evde huzur yaratmak, aileyle bağ kurmak ya da yaşam alanını güzelleştirmek.',
    'Yaratıcı bir projeye başlamak ya da romantik bir sürpriz yapmak.',
    'Sağlık için yeni bir alışkanlık başlatmak ya da işte verimliliği artırmak.',
    'Bir iş birliği ya da ilişkide yeni bir anlaşma zemini.',
    'Bir krizden güçlenerek çıkmak ya da ortak kaynaklarda avantaj yakalamak.',
    'Bir kursa yazılmak, seyahat planlamak ya da ufkunu genişleten biriyle tanışmak.',
    'Kariyerinde görünür olmak ve yetkililerin dikkatini çekmek.',
    'Yeni bir arkadaşlık ya da topluluk desteğiyle bir hayali büyütmek.',
    'Meditasyon, rüyalar ve sezgilerle gizli bir cevabı bulmak.'
  ],
  // Venüs'ün burca göre evi → aşkın genel tonu (haftalarca sürer)
  VEN: [
    'Venüs burcunda: çekiciliğin ve zarafetin dikkat çekiyor.',
    'Venüs para evinde: sevgi, güven ve maddi değerler iç içe.',
    'Venüs iletişim evinde: tatlı sözler ve mesajlar kalpleri yumuşatıyor.',
    'Venüs yuva evinde: ev ve aile içinde sevgi büyüyor.',
    'Venüs aşk evinde: romantizm ve flört için yılın en parlak dönemlerinden biri.',
    'Venüs günlük yaşam evinde: sevgi küçük iyiliklerde gizli.',
    'Venüs ilişkiler evinde: ortaklıklarda uyum ve yakınlaşma dönemi.',
    'Venüs tutku evinde: derin bağlar ve yoğun çekim.',
    'Venüs ufuk evinde: farklı kültürlerden ya da uzaktan gelen bir ilgi mümkün.',
    'Venüs kariyer evinde: iş çevresinde sevilen ve takdir edilen bir dönem.',
    'Venüs dostluk evinde: arkadaşlıktan aşka uzanan bağlar.',
    'Venüs gizli ev evinde: sessiz, saklı ya da geçmişten gelen duygular.'
  ],
  // Ay'ın burca göre konumuna element ilişkisi → ruh haline ek
  ELEM: {
    same: 'Ay senin elementinde; kendini doğal ve rahat hissediyorsun.',
    friend: 'Ay’ın enerjisi senin elementini destekliyor; akış kolay.',
    square: 'Ay’ın enerjisi senin tarzınla sürtüşüyor; esneklik göster.',
    neutral: ''
  },
  // Burca özel manifest (her burç için 3; günün tohumuyla seçilir)
  MANI: [
    ['Cesaretim yolumu açıyor; bugün kendim için ilk adımı atıyorum.', 'Enerjimi bilinçle kullanıyorum; öfkem değil, tutkum yönlendiriyor.', 'Yeni başlangıçlar bana doğal geliyor; hayatıma taze bir sayfa açıyorum.'],
    ['Bolluğu ve huzuru hayatıma kabul ediyorum; değerimi biliyorum.', 'Sabrım en büyük gücüm; her şey zamanında ve güzelce gerçekleşiyor.', 'Bedenimi ve duyularımı sevgiyle onurlandırıyorum.'],
    ['Sözlerim şifa ve ilham taşıyor.', 'Merakım beni doğru kapılara götürüyor; öğrenmeye açığım.', 'Zihnim sakin ve berrak; düşüncelerimi özgürce ifade ediyorum.'],
    ['Kalbim güvenli bir liman; sevgi verirken kendimi de besliyorum.', 'Duygularım bana yol gösteriyor; onlara güveniyorum.', 'Geçmişle barışıyorum; köklerim beni taşıyor, bağlamıyor.'],
    ['Işığımı korkusuzca parlatıyorum ve başkalarına da ilham veriyorum.', 'Kalbimden gelen yaratıcılığa izin veriyorum.', 'Sevilmeye ve görülmeye layığım; kendimi takdir ediyorum.'],
    ['Yeterince iyiyim; mükemmel olmak zorunda değilim.', 'Küçük adımlarla büyük şifalar yaratıyorum.', 'Bedenime ve zihnime gösterdiğim özen bana huzur getiriyor.'],
    ['İlişkilerimde hem kendime hem başkasına adil davranıyorum.', 'Hayatıma uyum, güzellik ve sevgi davet ediyorum.', 'Kararlarımı iç huzurumdan alıyorum.'],
    ['Dönüşümden korkmuyorum; her bitiş beni güçlendiriyor.', 'Sezgilerime güveniyor, gücümü şifa için kullanıyorum.', 'Bırakmam gerekeni sevgiyle bırakıyorum.'],
    ['Hayat bana her gün yeni ufuklar açıyor.', 'İnancım ve iyimserliğim yolumu aydınlatıyor.', 'Özgürce keşfediyor, deneyimlerimden bilgelik topluyorum.'],
    ['Hedeflerime sabırla ilerliyorum; emeğim kalıcı meyveler veriyor.', 'Başarıyı hak ediyorum ve dinlenmeyi de.', 'Sağlam temeller üzerine güzel bir hayat kuruyorum.'],
    ['Özgünlüğüm benim armağanım; olduğum gibi kabul görüyorum.', 'Beni anlayan ve destekleyen insanlarla çevriliyim.', 'Geleceği umutla ve cesaretle yaratıyorum.'],
    ['Sezgilerim bana rehberlik ediyor; evrenle akış içindeyim.', 'Hayallerim gerçekleşmek için bana yaklaşıyor.', 'Kendime şefkatle sarılıyor ve sınırlarımı koruyorum.']
  ]
};

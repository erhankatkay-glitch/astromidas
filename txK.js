/* Astrolog yorum motoru metinleri: baskın gezegen ve ev temaları, burç nitelikleri, gezegen durumları, hayat alanları, zamanlama. Özgün metinler. */
var TX = (typeof TX !== 'undefined') ? TX : {};
TX.AST = {
  // Haritada baskın gezegen olduğunda ana tema
  PL: {
    Sun: { t: 'Görünür olma ve kendini gerçekleştirme', s: 'Güneş haritanızın en güçlü noktalarından biri. Hayatınız, kim olduğunuzu ortaya koyma ve kendi yolunuzu çizme ihtiyacı etrafında şekilleniyor. Takdir edilmek sizin için yalnızca bir istek değil, yaşam enerjinizi besleyen bir kaynak; doğru yerde parladığınızda çevrenize de yön verirsiniz.', d: 'Liderlik, sahne, yaratıcı üretim ve kendi adınıza iş yapmak.' },
    Moon: { t: 'Duygusal derinlik ve korumacılık', s: 'Ay haritanızda belirleyici. Kararlarınızı çoğu zaman mantıktan önce sezgi ve duygu verir; ortamın havasını herkesten önce hissedersiniz. Güvende hissettiğiniz yerde açılırsınız; aile, yuva ve sevdiklerinize bakmak hayatınızın merkezinde durur.', d: 'Bakım veren meslekler, aile işleri, halkla temas ve duygusal zekâ gerektiren alanlar.' },
    Mercury: { t: 'Zihin, söz ve bağlantı', s: 'Merkür haritanızda öne çıkıyor. Düşünmek, konuşmak, yazmak ve öğrenmek sizin doğal ifade yolunuz; hayatınızın önemli dönüm noktaları bir konuşma, bir yazı ya da bir bilgiyle başlar. Zihninizi besleyen bir ortamda olmadığınızda hızla huzursuzlanırsınız.', d: 'Eğitim, yazarlık, ticaret, aracılık, medya ve danışmanlık.' },
    Venus: { t: 'Sevgi, uyum ve güzellik', s: 'Venüs haritanızın baskın gezegeni. İlişkiler, estetik ve paylaşılan keyifler hayatınızı anlamlı kılan şeyler. İnsanları yumuşatma ve bir araya getirme yeteneğiniz güçlü; ancak barışı korumak için kendi isteğinizi geri plana itme eğiliminize dikkat etmek gerekir.', d: 'Sanat, tasarım, güzellik, diplomasi, insan ilişkileri ve değerle ilgili işler.' },
    Mars: { t: 'Cesaret, mücadele ve eylem', s: 'Mars haritanızda güçlü. İstediğiniz şeye doğrudan gitmek, rekabet etmek ve harekete geçmek sizin doğanız. Engeller sizi durdurmaktan çok kamçılar; öfkenizi ve enerjinizi bilinçli bir hedefe yönlendirdiğinizde çok az kişinin yapabildiği atılımları yaparsınız.', d: 'Girişimcilik, spor, cerrahi, mühendislik, savunma ve öncü projeler.' },
    Jupiter: { t: 'Büyüme, anlam ve iyimserlik', s: 'Jüpiter haritanızda belirgin. Hayata geniş bir pencereden bakar, insanlarda ve durumlarda iyi olanı görürsünüz. Öğrenmek, öğretmek, seyahat etmek ve bir anlam peşinde koşmak sizi besler; şansınız çoğu zaman cömertliğiniz ve inancınızla birlikte gelir. Tek uyarı: aşırıya kaçma ve fazla söz verme eğilimi.', d: 'Eğitim, hukuk, yayıncılık, yurt dışı bağlantılar, inanç ve rehberlik.' },
    Saturn: { t: 'Sorumluluk, ustalık ve zamanla gelen güç', s: 'Satürn haritanızın ağırlık merkezi. Hayat size erken yaşta ciddiyet ve sorumluluk öğretmiş olabilir; kolay gelen şeylere değil, emekle kazanılana güvenirsiniz. Yaşla birlikte güçlenen, geç ama kalıcı başarılar haritası bu. Kendinize karşı katılığı yumuşatmak, en büyük iç dersiniz.', d: 'Yönetim, yapı kurma, mühendislik, hukuk, devlet ve uzun soluklu uzmanlık.' },
    Uranus: { t: 'Özgürlük, yenilik ve kırılma noktaları', s: 'Uranüs haritanızda baskın. Kalıplara sığmayan, sıra dışı ve bağımsız bir ruhunuz var. Hayatınız ani değişimler, beklenmedik fırsatlar ve sizi özgürleştiren kopuşlarla ilerler. Kendi doğrunuzu yaşamak, başkalarının onayından daha önemlidir.', d: 'Teknoloji, bilim, astroloji, yenilikçi girişimler ve toplumsal projeler.' },
    Neptune: { t: 'Sezgi, hayal gücü ve ruhsal arayış', s: 'Neptün haritanızda güçlü. İnce bir sezgiye, empatiye ve görünmeyeni hissetme yeteneğine sahipsiniz. Sanat, müzik, maneviyat ve şifa sizin dünyanız; ancak sınırlarınız bulanıklaşabilir, idealize etme ve hayal kırıklığı döngüsüne dikkat etmek gerekir.', d: 'Sanat, müzik, film, terapi, şifa, maneviyat ve yardım kuruluşları.' },
    Pluto: { t: 'Dönüşüm, güç ve derinlik', s: 'Plüton haritanızda belirleyici. Yüzeyle yetinmez, her şeyin özüne inmek istersiniz. Hayatınız kriz ve yeniden doğuş döngüleriyle ilerler; her yıkımdan daha güçlü çıkarsınız. Güç ve kontrol temalarını bilinçle taşımak, bu derin enerjiyi şifaya çevirir.', d: 'Psikoloji, araştırma, kriz yönetimi, finans, tıp ve dönüşüm işleri.' }
  },
  // Vurgulu ev teması
  H: [null,
    'Kimlik ve kendini ortaya koyma: hayatınızın merkezinde kendi yolunuzu bulmak ve kişiliğinizi özgürce ifade etmek var.',
    'Değer, kaynak ve güven: para, yetenekler ve öz-değer duygusu hayatınızın ana derslerinden biri.',
    'İletişim ve öğrenme: söz, yazı, kardeşler ve yakın çevre hayatınızı yönlendiren alan.',
    'Kökler ve yuva: aile, ev ve geçmişle ilişkiniz, kim olduğunuzun temelini oluşturuyor.',
    'Yaratıcılık ve aşk: kalbinizden geleni yaratmak, sevmek ve neşe hayatınızın itici gücü.',
    'İş, hizmet ve sağlık: günlük emek, ustalık ve bedenle ilişki öne çıkıyor.',
    'İlişkiler ve ortaklıklar: hayatınızın büyük dersleri ve armağanları başkalarıyla kurduğunuz bağlardan geliyor.',
    'Dönüşüm ve paylaşılan kaynaklar: derin bağlar, krizler ve yeniden doğuşlar hayatınızı şekillendiriyor.',
    'Anlam, inanç ve ufuk: eğitim, yolculuk ve hayat felsefesi kişisel büyümenizin ana yolu.',
    'Kariyer ve toplumsal yer: başarı, sorumluluk ve görünürlük hayatınızın merkezinde.',
    'Topluluk ve gelecek: dostluklar, gruplar ve idealler hayatınıza yön veriyor.',
    'İç dünya ve ruhsallık: görünmeyen alanlar, sezgiler ve şifa hayatınızın gizli merkezi.'
  ],
  // Burçların kısa nitelikleri (ev başlangıçlarında)
  SQ: ['cesur, hızlı ve doğrudan', 'istikrarlı, sadık ve somut', 'meraklı, değişken ve iletişime açık', 'duygusal, korumacı ve sadık', 'gururlu, cömert ve tutkulu', 'titiz, pratik ve hizmet odaklı', 'uyumlu, zarif ve adil', 'derin, tutkulu ve dönüştürücü', 'özgür, iyimser ve arayışçı', 'ciddi, sorumlu ve hedef odaklı', 'özgün, bağımsız ve arkadaşça', 'sezgisel, şefkatli ve hayalci'],
  // Gezegen durumu cümleleri: [yumuşak ton, net ton]
  COND: {
    domicile: ['{p} kendi burcunda: bu enerji sizde doğal, güçlü ve kendinden emin çalışıyor.', '{p} kendi burcunda; güçlü ve kendine yeterli.'],
    exalt: ['{p} yücelimde: bu alanda yetenekleriniz parlıyor, ama zaman zaman fazla beklenti de taşıyabilirsiniz.', '{p} yücelimde; bu alanda yüksek performans ve yüksek beklenti var.'],
    detriment: ['{p} zararda: bu enerji kendini ifade etmek için alışılmadık yollar arıyor; emekle çok özgün bir güce dönüşebilir.', '{p} zararda; bu alan emek ister, kendiliğinden akmaz.'],
    fall: ['{p} düşüşte: burada kendinize güvenmeniz zaman alabilir; bu yüzden bu alanda kazandığınız olgunluk çok değerlidir.', '{p} düşüşte; bu alanda özgüven sonradan kazanılır.'],
    peregrine: ['{p} burcunda belirgin bir güce sahip değil (peregrin); bu yüzden açı yaptığı gezegenlerden ve bulunduğu evden çok etkileniyor.', '{p} peregrin; yönünü açılardan ve evinden alıyor.'],
    retro: ['{p} retro: bu enerji önce içe dönüyor; dışarıya göstermeden önce kendi içinizde derinlemesine işliyorsunuz.', '{p} retro; içe dönük ve gecikmeli ama derin işler.'],
    combust: ['{p} Güneş’e çok yakın (yanık): bu yanınız güçlü olsa da kimliğinizin gölgesinde kalabiliyor; onu ayrıca görünür kılmak iyi gelir.', '{p} yanık; Güneş’in gölgesinde kalıyor.'],
    cazimi: ['{p} Güneş’in tam kalbinde (cazimi): klasik astrolojide en güçlü konumlardan biri; bu yetenek kimliğinizle bütünleşmiş.', '{p} cazimi; olağanüstü güçlü.'],
    angular: ['{p} bir köşe evde: hayatınızda görünür ve etkili; bu enerji olaylara doğrudan yansır.', '{p} köşe evde; etkili ve görünür.'],
    cadent: ['{p} düşen bir evde: etkisi daha sessiz, daha çok arka planda ve zihinsel düzlemde çalışıyor.', '{p} düşen evde; arka planda çalışır.'],
    benefic: ['{p}, {q} destekleyici bir açı alıyor: bu konuda koruma, kolaylık ve doğru zamanda gelen yardım var.', '{p}, {q} destek alıyor.'],
    malefic: ['{p}, {q} zorlayıcı bir açı alıyor: burada sınavlar ve gerilimler yaşanabilir; ama aynı gerilim sizi güçlendiren dersin kaynağı.', '{p}, {q} baskı görüyor; sınav ve gerilim.'],
    rules: ['Ayrıca {h} yönetiyor; bu yüzden bu konular da {g} durumuna göre şekilleniyor.', '{h} yöneticisi.']
  },
  // Hayat alanları
  AREAS: [
    { k: 'ask', n: 'Aşk ve ilişkiler', h: [7, 5], sig: ['Venus', 'Moon'], q: 'aşk ve ilişkiler', ex: ['İlişkilerde aradığınız şey, kendinizi güvende ve görülmüş hissetmek. Partnerinizde bilinçsizce kendi eksik parçanızı ararsınız.', 'İlişkiler hayatınızda önemli dönemeçler yaratır: evlilik, ortaklık ve ayrılık kararları sizi derinden dönüştürür.'] },
    { k: 'kariyer', n: 'Kariyer ve toplumsal yer', h: [10, 6], sig: ['Sun', 'Saturn'], q: 'kariyer', ex: ['Başarıyı yalnızca unvanla değil, yaptığınız işin size anlam katmasıyla ölçersiniz.', 'Kariyerinizde belirleyici olan; doğru sorumluluğu almak, görünür olmak ve doğru zamanda yön değiştirmektir.'] },
    { k: 'para', n: 'Para ve kaynaklar', h: [2, 8], sig: ['Venus', 'Jupiter'], q: 'para', ex: ['Parayla ilişkiniz öz-değer duygunuzla iç içe; kendinize değer verdikçe kazancınız da artar.', 'Kazanç kaynaklarınız, yeteneklerinizi somut hizmete dönüştürmenizle ve ortak kaynakları akıllıca yönetmenizle büyür.'] },
    { k: 'aile', n: 'Aile, ev ve kökler', h: [4], sig: ['Moon'], q: 'aile ve ev', ex: ['Ailenizden aldığınız duygusal miras, bugün nasıl sevdiğinizi ve nerede güvende hissettiğinizi belirliyor.', 'Ev, taşınma, aile büyükleri ve mülk konuları hayatınızın önemli olaylarını oluşturur.'] },
    { k: 'saglik', n: 'Sağlık ve enerji', h: [6, 1], sig: ['Mars', 'Sun'], q: 'sağlık', ex: ['Bedeniniz, bastırdığınız duyguları çoğu zaman zihninizden önce gösterir; stres size bedensel sinyallerle döner.', 'Düzenli rutin, hareket ve beslenme alışkanlıkları enerjinizi doğrudan belirler; bu alanda disiplin size iyi gelir.'] },
    { k: 'iletisim', n: 'Zihin, eğitim ve iletişim', h: [3, 9], sig: ['Mercury', 'Jupiter'], q: 'eğitim ve iletişim', ex: ['Öğrenme biçiminiz ve kendinizi ifade ediş tarzınız, dünyayla kurduğunuz bağın ana kanalı.', 'Eğitim, yazışmalar, yolculuklar ve kardeşlerle ilgili konular hayatınızda somut fırsatlar ve kararlar getirir.'] },
    { k: 'ruh', n: 'Ruhsal yol ve iç dünya', h: [12, 9], sig: ['Neptune', 'Jupiter'], q: 'ruhsal yol', ex: ['İç dünyanız zengin; yalnız kaldığınızda kendinizi yeniler, sezgilerinizle derin bir bağ kurarsınız.', 'Manevi arayışlar, inziva dönemleri ve görünmeyen destekler hayatınızın kritik anlarında belirleyici olur.'] }
  ],
  // Alan genel değerlendirmesi: [yumuşak, net]
  VERDICT: {
    good: ['Bu alan haritanızda güçlü destekli; doğal bir akış ve kolaylık var. Bu desteği bilinçli kullandığınızda en verimli alanlarınızdan biri olur.', 'Güçlü ve destekli bir alan.'],
    mixed: ['Bu alanda hem destek hem sınav bir arada: bazı dönemler kolay akarken bazıları emek ister. Dengeyi bulduğunuzda olgun ve sağlam bir yapı kurarsınız.', 'Karışık: destek de var, sınav da.'],
    hard: ['Bu alan haritanızda emek ve sabır istiyor; ama zorluklar burada en derin olgunluğunuzu ve dayanıklılığınızı yaratacak. Zamanla en güçlü yanınıza dönüşebilir.', 'Emek isteyen bir alan; olgunluk zamanla gelir.']
  },
  // Paragraf bağlaçları (tekrarı önlemek için dönüşümlü)
  CONN: ['Bunun yanında', 'Öte yandan', 'Buna ek olarak', 'Dikkat çekici bir ayrıntı olarak', 'Bu tabloyu tamamlayan bir diğer etken de şu:', 'Aynı temayı destekleyen bir başka işaret var:'],
  // Danışanın sorusuna göre giriş
  FOCUS: { genel: '', ask: 'Bu okuma, danışanın aşk ve ilişkiler sorusuna odaklanıyor.', kariyer: 'Bu okuma, danışanın kariyer sorusuna odaklanıyor.', para: 'Bu okuma, danışanın para ve kaynaklar sorusuna odaklanıyor.', aile: 'Bu okuma, danışanın aile ve ev sorusuna odaklanıyor.', saglik: 'Bu okuma, danışanın sağlık ve enerji sorusuna odaklanıyor.', iletisim: 'Bu okuma, danışanın eğitim ve iletişim sorusuna odaklanıyor.', ruh: 'Bu okuma, danışanın ruhsal yol sorusuna odaklanıyor.' }
};

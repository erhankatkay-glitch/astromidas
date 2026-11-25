/* Günlük rehber metinleri: kozmik mesaj, manifest, farkındalık sorusu, ritüel, Ay'ın ve gezegenlerin günlük açıları.
   Ay'ın burcu, fazı ve günün gerçek açılarıyla birleştirilerek her gün için özgün içerik üretilir. */
var TX = (typeof TX !== 'undefined') ? TX : {};
TX.DAY = {
  // Ay'ın burcuna göre günün kozmik mesajı (her burç için 6 seçenek; tarih tohumuyla seçilir)
  MSG: [
    ['Bugün hayatında değiştirmek istediğin şeyi ertelemek yerine ilk adımı at.', 'Cesaret, korkunun yokluğu değil; korkuya rağmen yürümektir. Bugün bir adım yeter.', 'İçindeki kıvılcımı başkalarının onayını beklemeden yak.', 'Sabırsızlığını bir pusulaya çevir: seni en çok ne heyecanlandırıyorsa oraya yönel.', 'Bugün başlattığın küçük şey, yarının büyük hikâyesinin ilk cümlesi olabilir.', 'Kendin için ayağa kalkmak bencillik değil, kendine verdiğin sözdür.'],
    ['Acele etme; köklenen her şey zamanında filizlenir.', 'Bugün bedenini dinle: sana neye ihtiyacın olduğunu zihninden önce o söyler.', 'Sahip olduklarına şükretmek, yenilerinin gelmesine yer açar.', 'Değerini başkalarının ölçüsüyle tartma; kendi terazin yeterince hassas.', 'Yavaşlamak geri kalmak değildir; bazen en hızlı yol sakin adımlardan geçer.', 'Güzellik küçük ayrıntılarda saklı; bugün onları fark etmeye zaman ayır.'],
    ['Bugün merakın seni doğru kişiye ve doğru bilgiye götürecek.', 'Söylemediğin cümle içinde ağırlaşır; nazikçe de olsa dile getir.', 'Her soru yeni bir kapı açar; bugün cevaplardan çok sorulara odaklan.', 'Zihnin dağınıksa bir kâğıda dök: düşünceler yazıya geçince netleşir.', 'Bir sohbet, bugün haftalardır aradığın fikri sana getirebilir.', 'Dinlemek de konuşmak kadar güçlüdür; bugün kulaklarını kalbinle birlikte aç.'],
    ['Kendine şefkat göstermek, başkalarına gösterdiğin şefkatin kaynağıdır.', 'Bugün yuvan seni çağırıyor: ister bir ev, ister bir insan, ister kendi kalbin olsun.', 'Duyguların zayıflık değil, seni hayata bağlayan köklerdir.', 'Geçmişi taşımak zorunda değilsin; ondan öğrendiklerini yanına alman yeterli.', 'Sevdiklerinle paylaşılan basit bir an, bugün en büyük şifa olabilir.', 'Kendini koruman gereken yerle kendini kapattığın yer aynı değildir; farkı hisset.'],
    ['Işığını kısma; senin parlaman başkalarına da cesaret verir.', 'Bugün kalbinden geleni yarat: mükemmel olması gerekmiyor, senin olması yeterli.', 'Takdir görmek istiyorsan önce kendini takdir etmeyi dene.', 'Oyun oynamak, gülmek ve hayatı kutlamak da ruhsal bir pratiktir.', 'Sahne senin; ama en güzel performans içtenliktir.', 'Cömertlik bugün sana katlanarak geri dönebilir.'],
    ['Küçük düzenler büyük huzurlar getirir; bugün bir köşeyi toparla.', 'Mükemmeliyetçilik seni durduruyorsa, “yeterince iyi” ile başla.', 'Bedenine iyi bakmak, ruhuna verdiğin en somut sevgi mesajıdır.', 'Bugün yardım etmek kadar yardım istemek de bir erdem.', 'Ayrıntılarda kaybolma; resmin bütününe de bir kez bak.', 'Gündelik rutinlerin içinde de kutsallık var; onları özenle yap.'],
    ['Denge, iki uç arasında donup kalmak değil; ikisi arasında dans etmektir.', 'Bugün ilişkilerinde adil olanı ara, ama kendini de terazinin dışında bırakma.', 'Güzellik bir lüks değil, ruhun ihtiyacıdır; çevreni güzelleştir.', 'Herkesi memnun edemezsin; önce kendinle barış.', 'Bir uzlaşma, bugün aylardır süren bir gerginliği çözebilir.', 'Karar vermemek de bir karardır; bugün netleşmenin zamanı.'],
    ['Bırakman gerekeni bırakmadan yenisine yer açamazsın.', 'Bugün yüzeyin altına bak: gerçek cevap orada seni bekliyor.', 'Sezgilerin bugün mantığından daha hızlı ve daha doğru konuşuyor.', 'Dönüşüm acıtabilir, ama kabuğunu kırmadan kanatların açılmaz.', 'Gizli tuttuğun bir duygu, ifade edildiğinde gücünü kaybeder.', 'Güvenmek bir risk; ama güvenmeden derinleşmek mümkün değil.'],
    ['Ufkunu genişlet: bugün bildiğin yolun dışına küçük bir adım at.', 'İnandığın şey seni ileri taşıyor mu, yoksa yerinde mi tutuyor?', 'Bir kitap, bir yolculuk ya da bir sohbet bugün zihnine pencere açabilir.', 'İyimserlik saflık değil, bilinçli bir seçimdir.', 'Anlamı uzaklarda arama; bugün yaşadığın deneyimin içinde de var.', 'Özgürlük, sorumluluktan kaçmak değil; seçimlerini sahiplenmektir.'],
    ['Büyük hedefler, bugün atılan sıkıcı ama sağlam adımlarla kurulur.', 'Sınır koymak sevgisizlik değil; enerjini korumanın en olgun yoludur.', 'Bugün sorumluluklarını yük değil, ustalığa giden yol olarak gör.', 'Sabır, zamanın senin tarafında olduğunu bilmektir.', 'Ne inşa ettiğine bir kez daha bak: gerçekten senin hayalin mi?', 'Disiplin, kendine duyduğun saygının gündelik halidir.'],
    ['Farklı olmaktan korkma; senin tuhaflığın, dünyaya getirdiğin armağan olabilir.', 'Bugün bir dostluk, sandığından fazlasını sana geri verebilir.', 'Geleceği hayal etmek, onu yaratmanın ilk adımıdır.', 'Kalabalığın içinde kendi sesini kaybetme.', 'Bir fikri paylaş; topluluk onu senden daha büyük bir şeye dönüştürebilir.', 'Özgürlüğünü korurken bağ kurmanın yolunu ara.'],
    ['Sezgilerin bugün fısıldıyor; sessiz kalırsan duyarsın.', 'Hayal kurmak kaçış değil; ruhun yeni dünyalar tasarlama biçimidir.', 'Şefkat sınırsız olabilir, ama enerjin sınırlıdır: kendini de kolla.', 'Bugün müzik, su ya da sanat ruhunu yıkayabilir.', 'Her şeyi kontrol etmeye çalışma; akışa güvenmek de bir beceridir.', 'Rüyalarına ve tesadüflere dikkat et; evren bugün semboller konuşuyor.']
  ],
  // Ay fazına göre kısa ek (mesajın altına)
  PHASEMSG: [
    'Yeni Ay: tohum ekme zamanı. Niyetini net koy, sonucu zorlamadan başla.',
    'Hilal: ilk adımların kırılgan ama değerli. Vazgeçme isteğine kulak asma.',
    'İlk Dördün: bir karar anı. Engel, yönünü netleştirmen için karşına çıktı.',
    'Şişkin Ay: ince ayar zamanı. Planını gözden geçir, eksiklerini tamamla.',
    'Dolunay: ışık her şeyi görünür kılıyor. Duygular yoğun; olgunlaşanı kutla.',
    'Yayılan Ay: öğrendiklerini paylaş, teşekkür et, cömert ol.',
    'Son Dördün: bırakma zamanı. Artık işine yaramayanı nazikçe uğurla.',
    'Balzamik Ay: dinlenme ve arınma. Yeni döngüden önce kendini boşalt.'
  ],
  // Ay'ın burcuna göre günlük manifest (olumlama)
  MANI: [
    ['Cesaretimi hatırlıyorum; hayatımın öncüsü benim.', 'İçimdeki ateş bana yol gösteriyor; harekete geçmekten korkmuyorum.', 'Yeni başlangıçlara açığım; her gün yeniden doğabilirim.', 'İstediğimi açıkça istiyorum ve buna layığım.'],
    ['Hayatıma güzellikleri, fırsatları ve bolluğu kabul ediyorum. Hak ettiğim güzelliklere açığım.', 'Bedenim benim evim; ona sevgiyle ve sabırla bakıyorum.', 'Değerimi biliyorum ve emeğimin karşılığını almaya açığım.', 'Güvendeyim; ihtiyacım olan her şey zamanında bana geliyor.'],
    ['Zihnim berrak, sözlerim nazik ve doğru.', 'Merakım beni doğru insanlara ve doğru bilgilere götürüyor.', 'Kendimi rahatça ifade ediyorum; sesim duyulmaya değer.', 'Öğrenmeye ve değişmeye açığım.'],
    ['Duygularımı yargılamadan kabul ediyorum; onlar bana yol gösteriyor.', 'Kendime ve sevdiklerime şefkatle bakıyorum.', 'Kalbim güvenli bir yuva; sevgi orada büyüyor.', 'Geçmişle barışıyorum ve şimdiye yerleşiyorum.'],
    ['Işığımı korkusuzca parlatıyorum.', 'Yaratıcılığım sınırsız; kalbimden geleni dünyaya sunuyorum.', 'Sevilmeye ve takdir edilmeye layığım.', 'Hayatımı neşeyle ve cömertlikle yaşıyorum.'],
    ['Küçük adımlarla büyük değişimler yaratıyorum.', 'Bedenime ve zihnime özenle bakıyorum; şifa içimde.', 'Yeterince iyiyim; mükemmel olmak zorunda değilim.', 'Hizmet ettiğim her şey bana da huzur getiriyor.'],
    ['İlişkilerimde dengeyi ve karşılıklı saygıyı seçiyorum.', 'Hayatıma uyum, güzellik ve zarafet davet ediyorum.', 'Hem kendime hem başkalarına adil davranıyorum.', 'Kararlarımı iç huzurumdan alıyorum.'],
    ['Artık bana hizmet etmeyeni sevgiyle bırakıyorum.', 'Dönüşümden korkmuyorum; her bitiş yeni bir doğumdur.', 'Derin sezgilerime güveniyorum.', 'Gücümü geri alıyorum ve onu şifa için kullanıyorum.'],
    ['Hayat bana her gün yeni ufuklar açıyor.', 'İyimserliğim ve inancım yolumu aydınlatıyor.', 'Özgürce keşfediyorum ve deneyimlerimden bilgelik topluyorum.', 'Anlamlı bir hayat yaşamaya açığım.'],
    ['Hedeflerime sabır ve kararlılıkla ilerliyorum.', 'Sağlam temeller kuruyorum; emeğim kalıcı meyveler veriyor.', 'Sınırlarımı saygıyla koruyorum.', 'Başarıyı hak ediyorum ve onu taşıyacak olgunluğa sahibim.'],
    ['Özgünlüğümü kutluyorum; farklılığım benim gücüm.', 'Beni destekleyen insanlarla çevriliyim.', 'Geleceğe umutla bakıyorum ve onu birlikte yaratıyoruz.', 'Zihnim yeni fikirlere ve ilhamlara açık.'],
    ['Evrenle akış içindeyim; sezgilerim bana rehberlik ediyor.', 'Hayallerim gerçekleşmek için bana geliyor.', 'Kendimi affediyorum ve şefkatle sarıyorum.', 'Ruhumu besleyen sessizliğe ve güzelliğe yer açıyorum.']
  ],
  // Ay'ın burcuna göre günün farkındalık sorusu
  Q: [
    ['Gerçekten ne istiyorum, yoksa başkalarının benden beklediğini mi yaşıyorum?', 'Neyi başlatmaktan korkuyorum ve bu korku beni neden koruyor?', 'Öfkem bana hangi sınırı göstermek istiyor?', 'Bugün kendim için nerede ayağa kalkmalıyım?', 'Sabırsızlığımın altında hangi ihtiyaç yatıyor?'],
    ['Bana gerçekten güven veren nedir: sahip olduklarım mı, olduğum kişi mi?', 'Bedenim bugün bana ne söylüyor?', 'Neye tutunuyorum ve bırakırsam ne olur?', 'Kendime değer verdiğimi nasıl gösteriyorum?', 'Hangi küçük keyif bugün ruhumu besler?'],
    ['Kafamdaki hangi hikâye gerçek değil?', 'Kime söylemem gereken ama söyleyemediğim bir şey var?', 'Bugün gerçekten dinliyor muyum, yoksa sıramı mı bekliyorum?', 'Merakım beni nereye çağırıyor?', 'Hangi düşünce beni en çok yoruyor ve ona ne kadar inanıyorum?'],
    ['Kendime bugün nasıl annelik edebilirim?', 'Hangi eski duygu hâlâ bugünümü yönetiyor?', 'Kendimi nerede ve kimin yanında güvende hissediyorum?', 'Başkalarına verdiğim şefkatin ne kadarını kendime veriyorum?', 'Yuvam bana ne hissettiriyor ve ne hissettirmesini istiyorum?'],
    ['Neyi kimse görmese de yapardım?', 'Takdir görme ihtiyacım beni nerede yönlendiriyor?', 'İçimdeki çocuk bugün ne yapmak isterdi?', 'Kalbimin gerçekten istediği yaratım ne?', 'Işığımı kimin yanında kısıyorum ve neden?'],
    ['Mükemmel olmak zorunda olmasaydım bugün ne yapardım?', 'Hangi alışkanlığım bana hizmet ediyor, hangisi beni tüketiyor?', 'Kendimi eleştirirken kimin sesini duyuyorum?', 'Bugün bedenim için yapabileceğim en küçük iyilik ne?', 'Yardım istemekten neden çekiniyorum?'],
    ['Bu ilişkide kendim olabiliyor muyum?', 'Barışı korumak için neyi susturuyorum?', 'Hayatımda dengeyi bozan tek şey ne?', 'Karar veremediğim konuda gerçekten neyden korkuyorum?', 'Adalet benim için ne anlama geliyor ve kendime adil miyim?'],
    ['Neyi kontrol etmeye çalışıyorum ve bu bana neye mal oluyor?', 'Hangi duyguyu kendimden bile saklıyorum?', 'Bırakmaya hazır olduğum şey ne?', 'Güvenmek benim için neden zor?', 'Gücümü kime ya da neye teslim ettim?'],
    ['Hangi inanç beni sınırlıyor?', 'Hayatıma anlam katan şey ne?', 'Özgürlük benim için ne demek?', 'Bugün hangi kapıyı aralamak istiyorum?', 'Neyi öğrenmeye gerçekten açığım?'],
    ['Başarı benim tanımımla neye benziyor?', 'Hangi sorumluluk aslında bana ait değil?', 'Kendime ne zaman dinlenme izni veriyorum?', 'On yıl sonra bugünkü kararıma nasıl bakacağım?', 'Kontrolü bırakırsam ne olur?'],
    ['Ait olmak için kendimden neyi feda ediyorum?', 'Hangi topluluğun parçası olmak beni besliyor?', 'Geleceğe dair en cesur hayalim ne?', 'Farklılığımı saklıyor muyum?', 'Duygularımdan kaçmak için zihnime mi sığınıyorum?'],
    ['Sınırlarım nerede bulanıklaşıyor?', 'Hangi hayalimi gerçeklikten korktuğum için erteliyorum?', 'Kimi ya da neyi kurtarmaya çalışıyorum?', 'Sezgim bugün bana ne fısıldıyor?', 'Kendimi affetmem gereken bir konu var mı?']
  ],
  // Ay fazına göre 2–5 dakikalık ritüeller: [başlık, süre, adımlar]
  RIT: [
    [['Niyet tohumu', '3 dk', 'Bir kâğıda yeni döngü için tek bir niyet yaz; şimdiki zaman kipinde ve olumlu cümleyle. Kâğıdı katla, avucunda tutup üç derin nefes al ve onu görebileceğin bir yere koy.'], ['Boş sayfa', '4 dk', 'Önüne boş bir sayfa al ve “Bu ay kendime izin veriyorum…” cümlesini beş kez farklı biçimlerde tamamla.'], ['Karanlıkta mum', '3 dk', 'Işıkları kıs, bir mum yak. Alevi izlerken “Neyi başlatmak istiyorum?” diye sor ve ilk gelen cevabı not et.']],
    [['İlk adım listesi', '3 dk', 'Niyetin için atabileceğin üç çok küçük adımı yaz. Birini bugün yap ve yanına bir tik at.'], ['Cesaret nefesi', '2 dk', 'Dört saniye nefes al, dört saniye tut, altı saniyede ver. Her verişte “Devam ediyorum” de. Beş tur yap.'], ['Tohum suyu', '3 dk', 'Bir bitkiyi sularken niyetini sessizce tekrar et; büyümenin sabır istediğini hatırla.']],
    [['Engel haritası', '4 dk', 'Seni zorlayan durumu yaz. Altına “Bu bana ne öğretiyor?” ve “Bugün atabileceğim tek adım ne?” sorularını cevapla.'], ['Güç duruşu', '2 dk', 'Ayakta dur, omuzlarını aç, ellerini beline koy. İki dakika derin nefesle kalırken “Bununla başa çıkabilirim” de.'], ['Karar kartı', '3 dk', 'Erteleyen bir kararın iki seçeneğini yaz; her birinin yanına bedeninde hissettiğin duyguyu not et.']],
    [['İnce ayar', '4 dk', 'Bu döngüde başladığın şeye bak: neyi düzeltmen, neyi bırakman, neyi eklemen gerekiyor? Her biri için bir kelime yaz.'], ['Beden taraması', '5 dk', 'Gözlerini kapat; dikkatini ayak parmaklarından başının tepesine yavaşça taşı. Gergin bir yer bulduğunda oraya nefes gönder.'], ['Şükran üçlüsü', '2 dk', 'Bugün yolunda giden üç şeyi yaz; ne kadar küçük olursa o kadar iyi.']],
    [['Dolunay bırakışı', '5 dk', 'Bırakmak istediğin üç şeyi bir kâğıda yaz. Yüksek sesle oku, “Artık sana ihtiyacım yok, teşekkür ederim” de ve kâğıdı güvenle yırt.'], ['Ay ışığı suyu', '3 dk', 'Bir bardak suyu pencere önüne koy, avuçlarını üzerine tutup niyetini fısılda. Ertesi sabah yavaşça iç.'], ['Kutlama listesi', '3 dk', 'Son iki haftada başardığın, ne kadar küçük olursa olsun beş şeyi yaz ve kendini tebrik et.']],
    [['Paylaşım notu', '3 dk', 'Bu döngüde öğrendiğin bir şeyi birine mesajla anlat ya da teşekkür etmek istediğin kişiye kısa bir not gönder.'], ['Bilgelik cümlesi', '2 dk', 'Son günlerin sana öğrettiği dersi tek cümleyle yaz ve telefonunun ekranına not olarak koy.'], ['Cömertlik anı', '3 dk', 'Bugün karşılık beklemeden yapabileceğin küçük bir iyiliği seç ve hemen yap.']],
    [['Çekmece temizliği', '5 dk', 'Bir çekmeceyi ya da telefonundaki bir klasörü aç; artık kullanmadığın beş şeyi at. Fiziksel düzen zihinsel alan açar.'], ['Affetme nefesi', '3 dk', 'Kırgın olduğun bir durumu düşün. Nefes alırken “Görüyorum”, verirken “Bırakıyorum” de. Yedi tur yap.'], ['Hayır listesi', '3 dk', 'Enerjini tüketen ve artık “hayır” demek istediğin üç şeyi yaz.']],
    [['Sessiz dinlenme', '5 dk', 'Telefonu uzağa koy, uzan ya da rahat otur. Hiçbir şey yapmadan sadece nefesini izle; dalıp gitmene izin ver.'], ['Rüya defteri', '3 dk', 'Bu gece için yastığının yanına bir defter koy ve “Bugün neyi tamamlamam gerekiyor?” sorusunu yazıp uykuya dal.'], ['Tuzlu su arınması', '4 dk', 'Ellerini ılık, tuzlu suda tut ya da tuzlu bir duş al; gün boyu taşıdıklarını suya bıraktığını hayal et.']]
  ],
  // Ay'ın burcunda ön planda olan konular ve dikkat edilecekler
  FOCUS: [
    ['yeni girişimler, beden enerjisi, cesaret gerektiren adımlar', 'aceleci kararlar, öfke patlamaları ve küçük kazalar'],
    ['para, konfor, beden bakımı, güzel ve somut şeyler', 'inatlaşma, aşırı yeme ve değişime direnç'],
    ['yazışmalar, görüşmeler, kısa yolculuklar, öğrenme', 'dağınıklık, dedikodu ve yarım kalan işler'],
    ['ev, aile, anılar, duygusal ihtiyaçlar', 'alınganlık, geçmişe takılma ve kendini kapatma'],
    ['yaratıcılık, aşk, eğlence, kendini gösterme', 'gurur kırgınlıkları, savurganlık ve ilgi beklentisi'],
    ['düzen, sağlık, iş planı, ayrıntılar', 'aşırı eleştiri, kaygı ve mükemmeliyetçilik'],
    ['ilişkiler, uzlaşma, estetik, iş birlikleri', 'kararsızlık, başkalarını memnun etme çabası'],
    ['derin duygular, ortak kaynaklar, mahremiyet, dönüşüm', 'kıskançlık, kontrol isteği ve şüphecilik'],
    ['eğitim, inanç, yolculuk, büyük resim', 'abartılı vaatler, sabırsızlık ve dağınık enerji'],
    ['kariyer, sorumluluklar, uzun vadeli hedefler', 'katılık, aşırı çalışma ve duyguları bastırma'],
    ['arkadaşlar, topluluk, yenilik, gelecek planları', 'mesafelilik, isyan ve beklenmedik değişikliklere direnç'],
    ['sezgi, sanat, maneviyat, dinlenme', 'sınırların bulanıklaşması, kaçış ve yanılsamalar']
  ],
  // Ay'ın gün içindeki açıları: [kavuşum, uyumlu (üçgen/altmışlık), zorlu (kare/karşıt)]
  MOONASP: {
    Sun: ['Duygular ile irade aynı çizgide; yeni bir niyete başlamak için güçlü bir an.', 'İç dünya ile dış hedefler uyumlu; kendini rahat ve bütün hissedebilirsin.', 'İstediğinle ihtiyacın çatışabilir; ikisine de yer açan orta yolu ara.'],
    Mercury: ['Duygularını kelimelere dökmek kolaylaşıyor; önemli bir konuşma için uygun.', 'Akıl ve kalp birlikte çalışıyor; yazışmalar ve planlar akıcı.', 'Duygusal tepkiler düşünceyi bulandırabilir; cevap vermeden önce bir nefes al.'],
    Venus: ['Şefkat, güzellik ve yakınlık ihtiyacı artıyor; kendini şımart.', 'İlişkilerde sıcaklık ve uyum; barışmak ya da gönül almak için güzel bir zaman.', 'Sevgi beklentisi ile gerçeklik arasında küçük kırgınlıklar olabilir; harcamalara dikkat.'],
    Mars: ['Duygular hızlı ve ateşli; enerjini fiziksel bir işe yönlendir.', 'Cesaret ve motivasyon yüksek; ertelediğin işe girişmek için iyi bir an.', 'Sabırsızlık ve tartışma eğilimi; tepki vermek yerine harekete geç.'],
    Jupiter: ['İyimserlik ve cömertlik artıyor; büyük düşünmek için uygun.', 'Şans ve destek akışı; yardım istemek ya da teklif sunmak için güzel zaman.', 'Abartma ve aşırılık eğilimi; vaatlerini ve porsiyonlarını ölç.'],
    Saturn: ['Duygular ciddileşiyor; sorumluluk almak sana güven verebilir.', 'Disiplin ve kararlılık kolaylaşıyor; uzun vadeli işler için verimli.', 'Yalnızlık ya da yetersizlik hissi gelebilir; kendine katı davranma.'],
    Uranus: ['Ani bir sezgi ya da beklenmedik bir haber; esnek kal.', 'Yenilik ve özgürleşme isteği; rutine küçük bir değişiklik kat.', 'Huzursuzluk ve ani kararlar; sinirlerini yatıştıracak bir mola ver.'],
    Neptune: ['Sezgiler ve hayal gücü yükseliyor; sanat, müzik ve meditasyon için ideal.', 'Şefkat ve ilham akışı; ruhsal pratikler ve yardım işleri destekleniyor.', 'Kafa karışıklığı ya da yanılsama riski; önemli imzaları ertele.'],
    Pluto: ['Derin duygular yüzeye çıkıyor; dönüştürücü bir farkındalık mümkün.', 'Psikolojik derinlik ve iyileşme; gizli bir konuyu çözmek için güçlü.', 'Kontrol ve güç çatışmaları tetiklenebilir; takıntılı düşünceleri bırak.']
  },
  // Gezegenlerin günlük anlam anahtarları (gezegen–gezegen açılarında kullanılır)
  PL: { Sun: 'irade ve kimlik', Moon: 'duygular', Mercury: 'iletişim ve düşünce', Venus: 'sevgi, değerler ve para', Mars: 'eylem ve arzu', Jupiter: 'büyüme ve şans', Saturn: 'sorumluluk ve sınırlar', Uranus: 'değişim ve özgürlük', Neptune: 'hayaller ve sezgi', Pluto: 'güç ve dönüşüm', Chiron: 'yaralar ve şifa', NNode: 'kader yönü' },
  // Açı türüne göre günlük öneri
  ASPDAY: {
    con: 'birleşerek güçlü ve yeni bir tema başlatıyor; bu iki alan bugün iç içe.',
    sex: 'küçük bir fırsat kapısı aralıyor; adım atarsan karşılık bulursun.',
    squ: 'arasında gerilim var; bu sürtünme seni harekete geçmeye zorluyor.',
    tri: 'uyum içinde akıyor; çaba göstermeden destek gelebilir, değerlendir.',
    opp: 'karşı karşıya geliyor; dengeyi başkalarıyla ilişkilerde bulman gerekiyor.'
  },
  // Retro gezegenler için günlük not
  RETRO: {
    Mercury: 'Merkür retroda: yazışmaları iki kez kontrol et, cihazları yedekle, yeni sözleşme yerine eski işleri tamamla.',
    Venus: 'Venüs retroda: ilişkileri ve değerlerini gözden geçir; büyük estetik değişiklikler ve pahalı alımlar için bekle.',
    Mars: 'Mars retroda: enerji içe dönüyor; yeni kavgalar yerine yarım kalan işleri bitir.',
    Jupiter: 'Jüpiter retroda: büyüme dışarıdan değil içeriden; inançlarını ve planlarını yeniden değerlendir.',
    Saturn: 'Satürn retroda: sorumluluklarını ve sınırlarını gözden geçir; eksik temelleri sağlamlaştır.',
    Uranus: 'Uranüs retroda: özgürlük arayışı içsel bir devrime dönüşüyor.',
    Neptune: 'Neptün retroda: yanılsamalar dağılıyor; hayallerini gerçekçi bir gözle süz.',
    Pluto: 'Plüton retroda: derin dönüşüm içeride sürüyor; eski güç kalıplarıyla yüzleş.'
  },
  VOC: 'Boşlukta Ay: Ay bu aralıkta başka gezegenle açı yapmıyor. Yeni işlere başlamak, önemli kararlar ve alışverişler için uygun değil; dinlenme, tamamlama ve iç gözlem için uygun.',
  INGRESS: 'Ay {s} burcuna geçiyor: gün içinde ruh hali {k} bir tona dönüyor.'
};

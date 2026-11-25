/* Yorum metinleri 4: açılar, transitler, diğer teknikler */
// Her ikili: [ortak tema, uyumlu ifade, zorlayıcı ifade]
TX.PAIR = {
  'Sun-Moon': ['irade ile duygular, bilinç ile alışkanlıklar arasındaki ilişki', 'İstekleriniz ile ihtiyaçlarınız uyum içindedir; iç huzurunuz ve ebeveynlerinizden aldığınız örnek destekleyicidir.', 'Ne istediğinizle neye ihtiyaç duyduğunuz arasında bir gerilim vardır; iç çatışmalar sizi büyümeye zorlar.'],
  'Sun-Mercury': ['kimlik ile düşünce', 'Zihniniz kimliğinizle bütünleşmiştir.', 'Zihniniz kimliğinizle bütünleşmiştir.'],
  'Sun-Venus': ['kimlik ile sevgi ve estetik', 'Çekicilik, zarafet ve sevilen bir kişilik.', 'Çekicilik, zarafet ve sevilen bir kişilik.'],
  'Sun-Mars': ['irade ile eylem gücü', 'Yüksek enerji, cesaret ve kararlılık; hedeflerinize doğrudan ilerlersiniz.', 'Sabırsızlık, öfke ve çatışma eğilimi; enerjinizi bilinçli yönlendirmeniz gerekir.'],
  'Sun-Jupiter': ['kimlik ile büyüme ve inanç', 'İyimserlik, cömertlik ve şans; fırsatları çekersiniz.', 'Abartı, aşırı özgüven ve fazla söz verme eğilimi.'],
  'Sun-Saturn': ['kimlik ile sorumluluk ve sınırlar', 'Disiplin, olgunluk ve kalıcı başarı kapasitesi.', 'Kendinize güvensizlik, baba/otorite ile zor ilişki ve ağır sorumluluklar; zamanla sağlam bir öz-saygıya dönüşür.'],
  'Sun-Uranus': ['kimlik ile özgürlük ve yenilik', 'Özgün, yaratıcı ve yenilikçi bir kişilik.', 'Ani değişimler, isyan ve huzursuzluk; özgürlük ihtiyacı ilişkileri zorlayabilir.'],
  'Sun-Neptune': ['kimlik ile hayal gücü ve maneviyat', 'Sanatsal ilham, şefkat ve sezgi.', 'Kimlik belirsizliği, kaçış eğilimi ve hayal kırıklıkları; sınırları netleştirmek gerekir.'],
  'Sun-Pluto': ['kimlik ile güç ve dönüşüm', 'Güçlü irade, yenilenme ve derin içgörü.', 'Güç mücadeleleri, kontrol ihtiyacı ve yoğun krizler; dönüşümle güçlenirsiniz.'],
  'Moon-Mercury': ['duygular ile düşünce', 'Duygularınızı kolayca ifade eder, insanları iyi anlarsınız.', 'Duygular ve mantık çatışır; endişeli düşünce ve alınganlık.'],
  'Moon-Venus': ['duygular ile sevgi', 'Sıcak, şefkatli ve sevgi dolu bir doğa; uyumlu kadın ilişkileri.', 'Duygusal ihtiyaçlarla zevkler arasında dengesizlik; konforla avunma.'],
  'Moon-Mars': ['duygular ile eylem', 'Duygusal cesaret ve koruyucu güç.', 'Ani duygusal patlamalar, alınganlık ve evde gerilim.'],
  'Moon-Jupiter': ['duygular ile cömertlik', 'Duygusal cömertlik, iyimserlik ve koruma.', 'Duygusal aşırılıklar, fazla vermek ya da fazla yemek.'],
  'Moon-Saturn': ['duygular ile kontrol', 'Duygusal olgunluk, sadakat ve istikrar.', 'Duygusal soğukluk ya da bastırma; erken yaşta yalnızlık hissi. Kendinize şefkat göstermek iyileştirir.'],
  'Moon-Uranus': ['duygular ile özgürlük', 'Duygusal özgünlük ve sezgisel parlaklık.', 'Duygusal dalgalanmalar, huzursuzluk ve yakınlıktan kaçma.'],
  'Moon-Neptune': ['duygular ile sezgi', 'Derin empati, sanatsal hassasiyet ve sezgi.', 'Duygusal sınırların belirsizliği, kurban rolü ve kaçış eğilimi.'],
  'Moon-Pluto': ['duygular ile dönüşüm', 'Duygusal derinlik, iyileştirme gücü ve psikolojik sezgi.', 'Yoğun ve kontrolcü duygular; anneyle güç ilişkisi, kıskançlık.'],
  'Mercury-Venus': ['düşünce ile zarafet', 'Tatlı dilli, diplomatik ve sanatsal ifade yeteneği.', 'Tatlı dilli, diplomatik ve sanatsal ifade yeteneği.'],
  'Mercury-Mars': ['düşünce ile eylem', 'Keskin zekâ, hızlı karar ve ikna gücü.', 'Sert sözler, tartışmacılık ve zihinsel gerginlik.'],
  'Mercury-Jupiter': ['düşünce ile anlam', 'Geniş düşünce, öğretme ve iyimser iletişim.', 'Ayrıntıyı atlama, fazla söz verme ve abartılı konuşma.'],
  'Mercury-Saturn': ['düşünce ile disiplin', 'Derin, sistemli ve kalıcı düşünce; konsantrasyon gücü.', 'Karamsar düşünceler, öğrenmede güvensizlik ve kendini ifadede çekingenlik.'],
  'Mercury-Uranus': ['düşünce ile yenilik', 'Parlak, özgün ve sezgisel bir zekâ.', 'Sinirlilik, dağınıklık ve inatçı fikirler.'],
  'Mercury-Neptune': ['düşünce ile hayal gücü', 'Şiirsel, sezgisel ve yaratıcı düşünce.', 'Belirsizlik, unutkanlık ve yanlış anlaşılmalar.'],
  'Mercury-Pluto': ['düşünce ile derinlik', 'Araştırmacı, ikna edici ve derin zihin.', 'Saplantılı düşünce ve sözle güç mücadelesi.'],
  'Venus-Mars': ['sevgi ile arzu', 'Güçlü çekim, tutku ve sosyal enerji.', 'Aşkta gerilim ve tutku; arzu ile uyum çatışabilir.'],
  'Venus-Jupiter': ['sevgi ile bolluk', 'Şans, cömertlik ve hoş ilişkiler; sanatsal zevk.', 'Aşırı harcama, tembellik ve fazla beklenti.'],
  'Venus-Saturn': ['sevgi ile bağlılık', 'Sadık, ciddi ve kalıcı ilişkiler.', 'Aşkta çekingenlik, sevilmeme korkusu ve gecikmeler; zamanla olgun bir sevgi.'],
  'Venus-Uranus': ['sevgi ile özgürlük', 'Heyecan verici ve özgün ilişkiler; sıra dışı estetik.', 'Ani başlayan ve biten ilişkiler, bağlılıkta huzursuzluk.'],
  'Venus-Neptune': ['sevgi ile ideal', 'Romantik, şefkatli ve sanatsal bir ruh.', 'Partneri idealize etme ve aşkta hayal kırıklıkları.'],
  'Venus-Pluto': ['sevgi ile tutku', 'Derin, dönüştürücü ve tutkulu aşk.', 'Kıskançlık, saplantı ve ilişkide güç mücadelesi.'],
  'Mars-Jupiter': ['eylem ile genişleme', 'Girişimcilik, cesaret ve başarılı eylem.', 'Aşırı risk alma, sabırsızlık ve abartılı hamleler.'],
  'Mars-Saturn': ['eylem ile sınır', 'Dayanıklılık, disiplinli çaba ve stratejik güç.', 'Engellenmiş enerji, öfkeyi bastırma ve hayal kırıklığı; sabırla güçlenirsiniz.'],
  'Mars-Uranus': ['eylem ile ani değişim', 'Cesur yenilikler ve ani, etkili hamleler.', 'Ani öfke, aceleci hareketler ve kazalara dikkat.'],
  'Mars-Neptune': ['eylem ile ideal', 'İlham verici eylem ve şefkatli güç.', 'Yönsüzlük, enerji kaybı ve dolaylı öfke.'],
  'Mars-Pluto': ['eylem ile güç', 'Muazzam irade gücü ve dayanıklılık.', 'Güç mücadeleleri, öfke ve aşırılık; enerjiyi yapıcı yönlendirmek şart.'],
  'Jupiter-Saturn': ['genişleme ile sınır', 'Gerçekçi iyimserlik ve kalıcı başarı.', 'İyimserlik ile şüphe arasında gidip gelme.'],
  'Jupiter-Uranus': ['büyüme ile yenilik', 'Ani fırsatlar ve özgürleştirici şans.', 'Ani değişimlere fazla güvenme, istikrarsızlık.'],
  'Jupiter-Neptune': ['inanç ile hayal', 'Manevi ilham, cömertlik ve şefkat.', 'Gerçekçi olmayan beklentiler ve kandırılmaya açıklık.'],
  'Jupiter-Pluto': ['büyüme ile güç', 'Büyük ölçekli başarı ve etki gücü.', 'Güç ve kontrolü abartma.'],
  'Saturn-Uranus': ['gelenek ile yenilik', 'Yeni fikirleri somut yapılara dönüştürme.', 'Eski ile yeni arasında gerilim; ani kırılmalar.'],
  'Saturn-Neptune': ['gerçek ile hayal', 'Hayalleri gerçekleştirme disiplini.', 'Belirsiz korkular ve hayal kırıklıkları.'],
  'Saturn-Pluto': ['yapı ile dönüşüm', 'Dayanıklılık ve yapıları dönüştürme gücü.', 'Ağır baskılar ve zorlu dönüşümler.'],
  'Uranus-Neptune': ['nesil teması: yenilik ve ideal', 'Kuşağınızın yaratıcı ve manevi vizyonu.', 'Kuşağınızın idealleri ile değişim arasındaki gerilim.'],
  'Uranus-Pluto': ['nesil teması: devrim ve dönüşüm', 'Kuşağınızın köklü değişim gücü.', 'Kuşağınızın radikal kırılmaları.'],
  'Neptune-Pluto': ['nesil teması: kolektif dönüşüm', 'Uzun süreli kolektif manevi dönüşüm.', 'Uzun süreli kolektif manevi dönüşüm.']
};
TX.ASPNAT = {
  con: 'Kavuşum bu iki ilkeyi birleştirir; birbirlerinden ayrı düşünülemezler ve birlikte güçlü bir odak oluştururlar.',
  opp: 'Karşıtlık, bu iki ilke arasında bir denge arayışı getirir; çoğu zaman biri diğerine ilişkilerde yansıtılır.',
  tri: 'Üçgen akıcı ve doğal bir yetenek getirir; bu potansiyel kolayca kullanılır, ama farkında olunmazsa atıl kalabilir.',
  squ: 'Kare gerilim ve sürtünme yaratır; bu iç baskı aynı zamanda büyük bir başarı motorudur.',
  sex: 'Altmışlık bir fırsat açısıdır; çaba gösterildiğinde destekleyici sonuçlar verir.',
  qcx: 'Quincunx (150°), sürekli ayar gerektiren bir uyumsuzluktur; iki alan arasında esnek davranmayı öğretir.',
  ssx: 'Yarım altmışlık hafif bir sürtünme ve öğrenme fırsatı getirir.',
  ssq: 'Yarım kare küçük ama sürekli bir gerilim yaratır.',
  sqq: 'Bir buçuk kare ani ve dışsal olaylarla tetiklenen bir gerilimdir.',
  qui: 'Kuintil özel bir yaratıcı yetenek gösterir.',
  bqu: 'Bikuintil incelikli bir yaratıcı ustalık gösterir.'
};
TX.TRANSIT = {
  Jupiter: 'genişleme, fırsat ve iyimserlik getirir',
  Saturn: 'sınav, yapılandırma ve olgunlaşma getirir',
  Uranus: 'ani değişim, özgürleşme ve beklenmedik olaylar getirir',
  Neptune: 'çözülme, ilham ve belirsizlik getirir',
  Pluto: 'derin dönüşüm, güç meseleleri ve yeniden doğuş getirir',
  Mars: 'enerji, hareket ve çatışma getirir',
  Sun: 'dikkat ve canlılık getirir', Venus: 'uyum ve keyif getirir', Mercury: 'iletişim ve haber getirir', Moon: 'duygusal tetiklenme getirir'
};
TX.TRANSASP = { con: 'yeni bir döngü başlatır ve doğrudan etkiler', opp: 'dışsal bir yüzleşme ve farkındalık getirir', squ: 'gerilim ve harekete geçme baskısı yaratır', tri: 'akıcı destek ve kolaylık sağlar', sex: 'değerlendirilebilecek bir fırsat açar' };
TX.ELEMTXT = {
  'Ateş': 'Ateş baskın: coşkulu, cesur ve ilham veren bir doğa. Eylem ve heyecanla beslenirsiniz.',
  'Toprak': 'Toprak baskın: pratik, istikrarlı ve somut sonuçlara odaklı bir doğa.',
  'Hava': 'Hava baskın: zihinsel, sosyal ve iletişim odaklı bir doğa.',
  'Su': 'Su baskın: duygusal, sezgisel ve empatik bir doğa.',
  lowAteş: 'Ateş zayıf: motivasyon ve kendine güveni bilinçli beslemeniz gerekebilir.',
  lowToprak: 'Toprak zayıf: pratik işler, para ve düzen konusunda destek gerekebilir.',
  lowHava: 'Hava zayıf: duygularınızı ve deneyimlerinizi nesnel bir mesafeden görmek zorlayıcı olabilir.',
  lowSu: 'Su zayıf: duygularınızı tanımak ve ifade etmek zaman alabilir.'
};
TX.MODETXT = { 'Öncü': 'Öncü nitelik baskın: başlatıcı, girişimci ve harekete geçirici.', 'Sabit': 'Sabit nitelik baskın: kararlı, dayanıklı ve değişime dirençli.', 'Değişken': 'Değişken nitelik baskın: uyumlu, esnek ve çok yönlü.' };
TX.PHASE = [
  ['Yeni Ay', 'İçgüdüsel, spontane ve yeni başlangıçlara yönelik bir doğa. Hayata kendi deneyimiyle öğrenen biri.'],
  ['Hilal', 'Geçmişin ağırlığından kurtulup yeni bir yol açma çabası. Kararlılıkla ilerlersiniz.'],
  ['İlk Dördün', 'Eylem ve kriz anlarında güçlenen, yapı kuran bir doğa. Engelleri aşarak gelişirsiniz.'],
  ['Şişkin Ay', 'Mükemmelleştirme, analiz ve gelişme arzusu. Anlam ve teknik ustalık ararsınız.'],
  ['Dolunay', 'İlişkiler ve farkındalık yoluyla anlam bulan bir doğa. Karşıtlıkları dengelemeyi öğrenirsiniz.'],
  ['Saçılan Ay', 'Öğrendiğini paylaşan, öğreten ve yayan bir doğa.'],
  ['Son Dördün', 'Eski yapıları sorgulayan, inançlarını yeniden değerlendiren bir doğa.'],
  ['Balzamik Ay', 'Bir döngünün sonu: sezgisel, kehanetçi ve geleceğe tohum eken bir doğa.']
];
TX.PATTERN = {
  'Büyük Üçgen': 'Büyük Üçgen: aynı elementte üç gezegen birbirine üçgen yapar. Bu, o elementte doğal ve akıcı bir yetenek gösterir. Kolaylık bazen tembelliğe dönüşebilir; bilinçle kullanıldığında büyük bir kaynaktır.',
  'T-Kare': 'T-Kare: iki gezegen karşıt, üçüncüsü ikisine kare yapar. Haritanın en dinamik gerilim noktasıdır; odak gezegen hayatta sürekli çalıştığınız ve sonunda ustalaştığınız alanı gösterir.',
  'Büyük Haç': 'Büyük Haç: dört gezegen iki karşıtlık ve dört kare oluşturur. Çok yönlü gerilim, büyük bir dayanıklılık ve güç üretir.',
  'Yod': 'Yod (Tanrının Parmağı): iki gezegen altmışlık açıyla birbirine bağlanır ve ikisi de üçüncüye quincunx yapar. Tepe gezegen, hayatınızda özel bir görev ya da sürekli ayar gerektiren bir kader noktası olarak görülür.',
  'Uçurtma': 'Uçurtma: büyük üçgene karşıt bir gezegen eklenir. Yeteneklerin somut bir amaca yönlendirilmesini sağlar.',
  'Stelyum': 'Stelyum: aynı burç ya da evde üç veya daha fazla gezegen yoğunlaşır. Bu alan hayatınızda çok baskın bir temadır.'
};
TX.SHAPE = {
  'Demet': 'Demet: Gezegenler 120° içinde toplanmış. Odaklı, uzmanlaşmış ve belirli bir alanda yoğunlaşan bir yaşam.',
  'Kase': 'Kase: Gezegenler haritanın bir yarısında. Bir eksiklik duygusuyla, diğer yarıyı doldurmaya yönelik güçlü bir amaç.',
  'Kova (Kulplu)': 'Kova: Gezegenlerin çoğu bir yarıda, biri karşı tarafta tek başına. Bu “kulp” gezegeni, enerjinin aktığı ana kanaldır.',
  'Lokomotif': 'Lokomotif: Gezegenler 240° içinde, büyük bir boşluk var. Güçlü bir itici güç ve hedefe yönelim.',
  'Tahterevalli': 'Tahterevalli: Gezegenler iki karşıt grupta. Karşıt bakış açılarını dengeleme yaşam temasıdır.',
  'Dağınık': 'Dağınık: Gezegenler haritaya yayılmış. Çok yönlü ilgi alanları ve geniş bir yaşam deneyimi.',
  'Yayılmış': 'Yayılmış: Gezegenler düzensiz gruplar hâlinde. Bireysel, özgün ve kalıplara sığmayan bir kişilik.'
};
TX.RETRO = {
  Mercury: 'Merkür retro: Düşünce içe dönüktür; söylemeden önce derin işlenir. Yeniden okumak, yeniden düşünmek ve geçmişi anlamak güçlü yanınızdır.',
  Venus: 'Venüs retro: Sevgi ve değerler içsel olarak sorgulanır; ilişkilerde geleneksel kalıplar yerine kendi tanımınızı ararsınız.',
  Mars: 'Mars retro: Enerji ve öfke içe dönüktür; harekete geçmeden önce uzun süre planlarsınız.',
  Jupiter: 'Jüpiter retro: Kendi inanç sisteminizi içsel deneyimle kurarsınız; dış otoritelerden çok içsel bilgelik.',
  Saturn: 'Satürn retro: Sorumluluk ve otorite konusunda içsel bir disiplin; kendi kurallarınızı koyma ihtiyacı.',
  Uranus: 'Uranüs retro: İçsel bir özgürleşme ve kişisel bir devrim süreci.',
  Neptune: 'Neptün retro: Güçlü bir iç dünya ve kişisel maneviyat.',
  Pluto: 'Plüton retro: Dönüşüm içsel ve psikolojik düzeyde yaşanır.'
};
TX.PROFECT = [null, 'Kendinize, bedeninize ve yeni başlangıçlara odaklanan bir yıl.', 'Para, kaynaklar ve öz-değer yılı.', 'İletişim, öğrenme, kardeşler ve yakın çevre yılı.', 'Ev, aile ve kökler yılı.', 'Aşk, yaratıcılık, çocuklar ve keyif yılı.', 'İş, sağlık ve günlük düzen yılı.', 'İlişkiler, evlilik ve ortaklıklar yılı.', 'Ortak kaynaklar, kriz ve dönüşüm yılı.', 'Seyahat, eğitim ve inanç yılı.', 'Kariyer, statü ve hedefler yılı.', 'Arkadaşlar, gruplar ve umutlar yılı.', 'İçe dönüş, kapanışlar ve maneviyat yılı.'];
TX.SRHOUSE = [null, 'Yılın odağı sizsiniz: yeni bir başlangıç, kişisel yenilenme ve görünürlük.', 'Yılın odağı para, kazanç ve kaynakları güçlendirmek.', 'Yılın odağı iletişim, eğitim, kısa yolculuklar ve yakın çevre.', 'Yılın odağı ev, aile, taşınma ya da köklerle ilgili konular.', 'Yılın odağı aşk, yaratıcılık, çocuklar ve keyif.', 'Yılın odağı iş düzeni, sağlık ve günlük hayatı iyileştirmek.', 'Yılın odağı ilişkiler, evlilik ve ortaklıklar.', 'Yılın odağı ortak finans, dönüşüm ve derin psikolojik süreçler.', 'Yılın odağı seyahat, yüksek öğrenim ve ufuk genişletmek.', 'Yılın odağı kariyer, statü ve toplumsal başarı.', 'Yılın odağı arkadaşlar, gruplar ve gelecek planları.', 'Yılın odağı içe dönüş, dinlenme ve bir döngüyü kapatmak.'];

/* Yorum metinleri 1: gezegenler, burçlar, evler, Güneş/Ay/Yükselen burçlarda.
   Geleneksel (Batlamyus, Lilly) ve psikolojik astroloji ilkelerinden özgün olarak yazılmıştır. */
var TX = (typeof TX !== 'undefined') ? TX : {};
TX.P = {
  Sun: { n: 'Güneş', g: '☉', k: 'kimlik, irade, yaşam gücü, baba ve otorite figürleri', f: 'Güneş, haritanın merkezindeki öz-bilinçtir: kim olmak istediğiniz, neyle parladığınız ve hayatınıza yön veren temel amaç. Bulunduğu burç bu kimliğin üslubunu, bulunduğu ev ise kendinizi en çok hangi alanda gerçekleştirmeniz gerektiğini gösterir.' },
  Moon: { n: 'Ay', g: '☽', k: 'duygular, ihtiyaçlar, alışkanlıklar, anne ve yuva', f: 'Ay, duygusal doğanızı, güven ihtiyacınızı ve içgüdüsel tepkilerinizi anlatır. Kendinizi neyle beslediğinizi, stres altında nasıl davrandığınızı ve “evde” hissetmek için neye ihtiyaç duyduğunuzu gösterir.' },
  Mercury: { n: 'Merkür', g: '☿', k: 'zihin, konuşma, öğrenme, ticaret, kardeşler', f: 'Merkür, düşünme ve iletişim biçiminizdir: bilgiyi nasıl topladığınız, nasıl karar verdiğiniz ve kendinizi nasıl ifade ettiğiniz.' },
  Venus: { n: 'Venüs', g: '♀', k: 'sevgi, uyum, estetik, değerler, para', f: 'Venüs, neyi sevdiğinizi ve nasıl sevdiğinizi, ilişkilerde aradığınız uyumu, zevklerinizi ve neye değer verdiğinizi gösterir.' },
  Mars: { n: 'Mars', g: '♂', k: 'eylem, arzu, cesaret, rekabet, öfke', f: 'Mars, istediğinizin peşinden nasıl gittiğinizi, enerjinizi nasıl harcadığınızı, öfkeyi ve cinselliği nasıl yaşadığınızı anlatır.' },
  Jupiter: { n: 'Jüpiter', g: '♃', k: 'büyüme, inanç, şans, öğretmenler, uzak yerler', f: 'Jüpiter, hayatta genişlemek ve anlam bulmak istediğiniz yeri, iyimserliğinizi ve fırsatların en kolay geldiği alanı gösterir. Abartı ve aşırılık da onun gölgesidir.' },
  Saturn: { n: 'Satürn', g: '♄', k: 'sorumluluk, sınır, zaman, olgunluk, korku', f: 'Satürn, kendinizi yetersiz hissettiğiniz ama zamanla en sağlam ustalığı kazandığınız alandır. Disiplin, sınırlar ve gecikmelerle gelir; olgunlukla ödül verir.' },
  Uranus: { n: 'Uranüs', g: '♅', k: 'özgürlük, yenilik, ani değişim, özgünlük', f: 'Uranüs, kalıpları kırma isteğinizi, özgünlüğünüzü ve hayatınızda ani uyanışların yaşandığı alanı temsil eder.' },
  Neptune: { n: 'Neptün', g: '♆', k: 'hayal gücü, şefkat, maneviyat, belirsizlik', f: 'Neptün, sınırların eridiği yerdir: ilham, sanat, şefkat ve maneviyat kadar yanılsama, kaçış ve hayal kırıklığı da burada yaşanır.' },
  Pluto: { n: 'Plüton', g: '♇', k: 'dönüşüm, güç, kriz, yeniden doğuş', f: 'Plüton, derin dönüşümün, gücün ve kontrolün temasıdır. Bulunduğu alanda yüzeysellik kalmaz; kayıplar ve krizler yoluyla yeniden doğuş yaşanır.' },
  NNode: { n: 'Kuzey Ay Düğümü', g: '☊', k: 'gelişim yönü, ruhsal hedef', f: 'Kuzey Düğüm, bu yaşamda geliştirilmesi istenen yönü, alışık olmadığınız ama büyüten deneyimleri gösterir.' },
  SNode: { n: 'Güney Ay Düğümü', g: '☋', k: 'doğal yetenekler, alışkanlıklar, geçmiş', f: 'Güney Düğüm, hazır getirdiğiniz yetenekleri ve fazla yaslandığınız konfor alanını gösterir.' },
  Lilith: { n: 'Kara Ay (Lilith)', g: '⚸', k: 'bastırılan arzu, öfke, bağımsızlık', f: 'Kara Ay, toplumun ya da ailenin onaylamadığı için bastırdığınız, ama bütünleştirildiğinde size ham bir güç veren yanınızı gösterir.' },
  Asc: { n: 'Yükselen', g: 'ASC', k: 'beden, dış görünüş, ilk izlenim, yaşama yaklaşım', f: '' },
  MC: { n: 'Tepe Noktası (MC)', g: 'MC', k: 'kariyer, toplumsal rol, hedefler', f: '' },
  Vertex: { n: 'Vertex', g: 'Vx', k: 'kader buluşmaları', f: '' },
  Fortune: { n: 'Şans Noktası', g: '⊗', k: 'bedensel ve maddi iyilik', f: '' },
  Spirit: { n: 'Ruh Noktası', g: 'Sp', k: 'zihinsel amaç, irade', f: '' }
};
TX.S = [
  { g: '♈', k: 'cesur, doğrudan, sabırsız, öncü', st: 'atılgan ve doğrudan bir biçimde' },
  { g: '♉', k: 'sabırlı, kararlı, duyusal, sahiplenici', st: 'sakin, istikrarlı ve somut bir biçimde' },
  { g: '♊', k: 'meraklı, çevik, konuşkan, değişken', st: 'meraklı, hareketli ve çok yönlü bir biçimde' },
  { g: '♋', k: 'koruyucu, duygusal, sezgili, aidiyet arayan', st: 'duygusal, koruyucu ve sezgisel bir biçimde' },
  { g: '♌', k: 'yaratıcı, cömert, gururlu, görünür olmak isteyen', st: 'sıcak, yaratıcı ve kendinden emin bir biçimde' },
  { g: '♍', k: 'analitik, titiz, hizmetkâr, eleştirel', st: 'dikkatli, analitik ve işlevsel bir biçimde' },
  { g: '♎', k: 'diplomatik, estetik, adil, ilişki odaklı', st: 'uyum arayan, nazik ve dengeli bir biçimde' },
  { g: '♏', k: 'yoğun, derin, sadık, kontrolcü', st: 'yoğun, derin ve tutkulu bir biçimde' },
  { g: '♐', k: 'özgür, iyimser, felsefi, dolaysız', st: 'iyimser, özgür ve anlam arayan bir biçimde' },
  { g: '♑', k: 'disiplinli, hırslı, gerçekçi, sorumlu', st: 'ciddi, planlı ve sorumluluk sahibi bir biçimde' },
  { g: '♒', k: 'bağımsız, yenilikçi, insancıl, mesafeli', st: 'özgün, bağımsız ve ilerici bir biçimde' },
  { g: '♓', k: 'şefkatli, hayalperest, sezgisel, geçirgen', st: 'şefkatli, sezgisel ve hayal gücü yüksek bir biçimde' }
];
TX.H = [null,
  { n: 'Benlik', t: 'kişilik, beden, ilk izlenim ve hayata yaklaşım' },
  { n: 'Kaynaklar', t: 'para, mülk, yetenekler ve öz-değer' },
  { n: 'İletişim', t: 'iletişim, kardeşler, yakın çevre, kısa yolculuklar ve temel eğitim' },
  { n: 'Yuva', t: 'aile, ev, kökler, anne-baba ve iç dünya' },
  { n: 'Yaratıcılık', t: 'aşk, yaratıcılık, çocuklar, eğlence ve kendini ifade' },
  { n: 'Gündelik iş', t: 'gündelik iş, sağlık, rutinler ve hizmet' },
  { n: 'İlişkiler', t: 'evlilik, ortaklıklar, sözleşmeler ve açık rakipler' },
  { n: 'Ortak kaynaklar', t: 'ortak para, miras, borçlar, cinsellik, kriz ve dönüşüm' },
  { n: 'Ufuklar', t: 'yüksek öğrenim, inanç, felsefe, uzak yolculuklar ve yayın' },
  { n: 'Kariyer', t: 'kariyer, statü, toplumsal itibar ve hayat hedefleri' },
  { n: 'Topluluk', t: 'arkadaşlar, gruplar, sosyal ağlar ve gelecek umutları' },
  { n: 'Bilinçdışı', t: 'bilinçdışı, yalnızlık, gizli konular, kurumlar ve maneviyat' }
];

TX.SUN = [
  'Güneş Koç’ta: Kimliğinizi harekete geçerek, ilk adımı atarak ve meydan okumalara göğüs gererek kurarsınız. Rekabet sizi canlandırır; beklemek ise en çok zorlandığınız şeydir. Cesaretiniz başkalarına ilham verir, ama sabırsızlık ve düşünmeden tepki verme eğilimi enerjinizi dağıtabilir. Bir işi başlatma gücünüz yüksektir; kalıcı başarı için onu bitirmeyi de öğrenmeniz gerekir.',
  'Güneş Boğa’da: Kimliğiniz sağlamlık, güven ve somut sonuçlar üzerine kuruludur. Acele etmez, bir kez karar verdiğinizde kolay kolay vazgeçmezsiniz. Güzellik, doğa, iyi yemek ve dokunsal zevkler sizi besler. Değişime direnç ve inatçılık gölge yanınızdır; buna karşın sabrınız, uzun vadede çoğu kişinin ulaşamayacağı kalıcı değerler yaratmanızı sağlar.',
  'Güneş İkizler’de: Merakla yaşarsınız; bilgi toplamak, konuşmak, bağlantılar kurmak sizi canlı tutar. Aynı anda birden fazla ilgi alanınız olabilir ve hızlı öğrenirsiniz. Zekânız esnek, mizahınız kıvraktır. Dağınıklık ve yüzeysellik riski vardır; derinleşmek için ilgilerinizi birbirine bağlayan bir ana ip bulmak size iyi gelir.',
  'Güneş Yengeç’te: Kimliğinizin merkezinde aidiyet, aile ve duygusal güven vardır. Sevdiklerinizi korumak, onlar için bir yuva kurmak en güçlü motivasyonlarınızdandır. Sezgileriniz keskindir, ortamın duygusunu hemen hissedersiniz. Kırılganlığınızı korumak için kabuğa çekilebilir, geçmişe fazla bağlanabilirsiniz; kendinize gösterdiğiniz şefkat gücünüzün kaynağıdır.',
  'Güneş Aslan’da: Yaratmak, ifade etmek ve görülmek sizin için temel bir ihtiyaçtır. Sıcaklığınız ve cömertliğiniz çevrenize ışık saçar; liderlik doğal olarak size gelir. Takdir edilmediğinizde kırılabilir, gururunuz incinebilir. Kalbinizden gelen şeyi yaptığınızda en parlak hâlinizdesiniz; onay beklemeden kendi ışığınızı taşımayı öğrenmek önemli bir olgunluk adımıdır.',
  'Güneş Başak’ta: Kimliğinizi işe yararlık, ustalık ve özen üzerinden kurarsınız. Ayrıntıyı görür, düzensiz olanı düzenler, sorunlara pratik çözümler üretirsiniz. Hizmet etmek size anlam verir. Mükemmeliyetçilik ve kendinizi aşırı eleştirme gölge yanınızdır; “yeterince iyi” olanı kabul ettiğinizde hem siz hem çevreniz rahatlar.',
  'Güneş Terazi’de: İlişkiler, denge ve adalet duygusu kimliğinizin merkezindedir. Farklı bakış açılarını görür, insanları bir araya getirir, ortamı güzelleştirirsiniz. Estetik zevkiniz gelişmiştir. Çatışmadan kaçınmak ve başkalarının onayına fazla bağlanmak sizi kararsız bırakabilir; kendi ihtiyacınızı da teraziye koymak dengenin bir parçasıdır.',
  'Güneş Akrep’te: Yoğun, derin ve kararlı bir kimliğiniz vardır. Yüzeyin altını görmek, gerçeği bilmek istersiniz; yarım yamalak ilişkiler ve işler size göre değildir. Kriz anlarında güçlenir, başkalarının kaçtığı konulara cesaretle girersiniz. Kontrol ihtiyacı, kıskançlık ve kırgınlıkları uzun süre taşımak gölge yanınızdır; bırakabildiğiniz ölçüde dönüşürsünüz.',
  'Güneş Yay’da: Anlam arayışı, özgürlük ve keşif sizi tanımlar. Yeni fikirler, kültürler ve yolculuklar ruhunuzu besler; iyimserliğiniz bulaşıcıdır. Dürüstlüğünüz bazen fazla dolaysız olabilir. Taahhütlerden kaçma ve abartma eğilimine dikkat etmek gerekir; inandığınız bir ideale bağlandığınızda olağanüstü bir öğretmen ve rehber olabilirsiniz.',
  'Güneş Oğlak’ta: Kimliğinizi emek, sorumluluk ve somut başarılar üzerine inşa edersiniz. Uzun vadeli düşünür, hedefe adım adım ilerlersiniz. Ciddiyetiniz ve güvenilirliğiniz sizi doğal bir otorite yapar. Kendinize karşı aşırı katı olmak ve duyguları ertelemek gölge yanınızdır; yaşla birlikte daha rahat ve sıcak bir hâl kazanmanız tipiktir.',
  'Güneş Kova’da: Özgünlük, bağımsızlık ve topluluk bilinci kimliğinizin temelidir. Geleceğe bakar, alışılmışı sorgular, insanlara eşit davranırsınız. Arkadaşlık sizin için çok değerlidir. Duygusal mesafe ve inatla “farklı” olma ihtiyacı yakın ilişkilerde zorluk yaratabilir; kalbinizi de zihniniz kadar paylaşmak sizi bütünler.',
  'Güneş Balık’ta: Sezgisel, şefkatli ve hayal gücü güçlü bir kimliğiniz vardır. Başkalarının acısını hisseder, sanata, müziğe ve maneviyata yatkın olursunuz. Sınırlarınız geçirgendir; bu sizi hem ilham dolu hem de kolay yorulan biri yapar. Kaçış eğilimlerine karşı sağlıklı sınırlar ve düzenli bir yaratıcı ya da manevi pratik sizi güçlendirir.'
];
TX.MOON = [
  'Ay Koç’ta: Duygularınız hızlı ve yoğun gelir, çabuk da geçer. Bağımsız hareket edebildiğinizde güvende hissedersiniz. Öfkeniz ani parlayabilir; bunu hareket, spor ya da yeni bir başlangıçla boşaltmak size iyi gelir. Başkalarına duygusal destek verirken çözüm odaklısınız; bazen yalnızca dinlenmek istendiğini hatırlamak gerekir.',
  'Ay Boğa’da (yücelim): Duygusal açıdan sağlam ve sakin bir yapınız vardır. Güvende hissetmek için düzen, konfor, iyi yemek ve maddi güvence önemlidir. Sadık ve şefkatlisiniz; değişime alışmanız zaman alır. Stres altında yemek ya da harcama yoluyla rahatlama eğilimi olabilir; doğada vakit geçirmek sizi kolayca dengeler.',
  'Ay İkizler’de: Duygularınızı konuşarak, yazarak ve anlamlandırarak işlersiniz. Zihinsel uyarılma ihtiyacınız yüksektir; sıkıldığınızda huzursuzlanırsınız. Ruh hâliniz hızlı değişebilir. Duyguları analiz etmek onları hissetmenin önüne geçebilir; yine de esprili ve iletişime açık yapınız ilişkilerde büyük bir zenginliktir.',
  'Ay Yengeç’te (yönetici): Ay burada en güçlü hâlindedir. Duygusal derinliğiniz, sezginiz ve koruyucu içgüdünüz çok güçlüdür. Aile, yuva ve geçmiş sizin için kutsaldır. Alınganlık ve geçmiş kırgınlıkları bırakmakta zorlanma gölge yanınızdır; kendinize de başkalarına gösterdiğiniz bakımı gösterdiğinizde çok güçlenirsiniz.',
  'Ay Aslan’da: Sevildiğinizi ve takdir edildiğinizi hissetmek duygusal güvenliğinizin temelidir. Cömert, sıcak ve sadık bir kalbiniz vardır; sevdiklerinizi şımartmayı seversiniz. Görmezden gelinmek sizi derinden yaralar. Yaratıcı ifade, oyun ve eğlence ruh hâlinizi hızla yükseltir.',
  'Ay Başak’ta: Düzen, işe yararlık ve kontrol hissi size güven verir. Sevginizi pratik yardım ve özenle gösterirsiniz. Endişe ve kaygı, duyguları bedeninizde (özellikle sindirim) hissetmenize neden olabilir. Her şeyi düzeltme ihtiyacını bırakıp kendinize şefkat göstermek önemli bir iyileşme alanıdır.',
  'Ay Terazi’de: Uyumlu ilişkiler ve güzel ortamlar duygusal dengenizin anahtarıdır. Yalnızlıktan çok, paylaşmaktan beslenirsiniz. Çatışma sizi derinden rahatsız eder; huzur için kendi duygularınızı bastırabilirsiniz. Gerçek uyumun, dürüstçe ifade edilen ihtiyaçlarla mümkün olduğunu fark etmek sizi özgürleştirir.',
  'Ay Akrep’te (düşüş): Duygularınız derin, yoğun ve çoğu zaman gizlidir. Güvenmeniz zaman alır; güvendiğinizde ise tüm benliğinizle bağlanırsınız. İhanet hissine karşı çok hassassınız. Duyguları kontrol etme ve saklama eğilimi içsel baskı yaratabilir; terapi, yazı ya da derin sohbetler duygusal dönüşüm için güçlü araçlardır.',
  'Ay Yay’da: Özgürlük, hareket ve anlam duygusal ihtiyaçlarınızdır. İyimser ve neşelisiniz; zor duygulardan kaçıp “her şey yoluna girecek” deme eğiliminiz olabilir. Seyahat, öğrenme ve açık hava sizi besler. Sizi kısıtlayan ortamlarda çabuk daralırsınız.',
  'Ay Oğlak’ta (zarar): Duygularınızı kontrollü ve olgun bir biçimde yaşarsınız; çoğu zaman erken yaşta sorumluluk almış olabilirsiniz. Güvende hissetmek için yapı ve başarı önemlidir. Kırılganlığı göstermekte zorlanabilir, ihtiyaçlarınızı ertelersiniz. Kendinize dinlenme ve duygusal destek alma izni vermek önemli bir dengedir.',
  'Ay Kova’da: Duygusal özgürlüğe ve kişisel alana ihtiyaç duyarsınız. Arkadaşlık ve ortak idealler sizi besler. Duyguları akıl süzgecinden geçirir, kriz anında soğukkanlı kalabilirsiniz. Yakınlık ihtiyacınızı inkâr etmemek ve duygularınızın da “mantıklı” olmak zorunda olmadığını kabul etmek size iyi gelir.',
  'Ay Balık’ta: Son derece duyarlı, şefkatli ve sezgisel bir duygusal doğanız vardır. Ortamın ruh hâlini sünger gibi emersiniz. Müzik, sanat, deniz ve manevi pratikler sizi iyileştirir. Sınır koymakta zorlanmak ve gerçeklikten kaçma eğilimi gölge yanınızdır; yalnız kalıp yenilenme zamanı ayırmak şarttır.'
];
TX.ASC = [
  'Yükselen Koç: Hayata enerjik, doğrudan ve cesur bir yaklaşımınız var. İnsanlar sizi ilk anda aktif, hızlı ve rekabetçi biri olarak algılar. Bedeniniz hareket ister; baş bölgesi hassas olabilir. Haritanızın yöneticisi Mars’tır; Mars’ın konumu yaşam yönünüzü güçlü biçimde belirler.',
  'Yükselen Boğa: Sakin, güven veren ve hoş bir ilk izlenim bırakırsınız. Hayata temkinli ve sabırlı yaklaşır, aceleye gelmezsiniz. Görünüşünüzde ve çevrenizde estetiğe önem verirsiniz; boğaz ve boyun bölgesi hassastır. Harita yöneticiniz Venüs’tür.',
  'Yükselen İkizler: Canlı, meraklı ve konuşkan görünürsünüz; genç bir enerjiniz vardır. Hayata öğrenme ve iletişim üzerinden yaklaşırsınız. Eller, kollar ve sinir sistemi hassastır. Harita yöneticiniz Merkür’dür; Merkür’ün konumu hayattaki ana ilgi alanınızı gösterir.',
  'Yükselen Yengeç: Yumuşak, korumacı ve duyarlı bir ilk izlenim bırakırsınız. Yeni ortamlara önce temkinle yaklaşır, güvendiğinizde açılırsınız. Ruh hâliniz yüzünüze kolayca yansır. Harita yöneticiniz Ay’dır; duygusal durumunuz hayat yönünüzü doğrudan etkiler.',
  'Yükselen Aslan: Göz önünde olan, sıcak ve etkileyici bir duruşunuz vardır. Girdiğiniz ortamda fark edilirsiniz; saçınız ve duruşunuz dikkat çeker. Onurunuz ve itibarınız sizin için önemlidir. Harita yöneticiniz Güneş’tir; Güneş’in ev konumu hayat sahnenizi belirler.',
  'Yükselen Başak: Düzenli, dikkatli ve mütevazı bir izlenim bırakırsınız. Hayata analiz ederek, önce durumu anlamaya çalışarak yaklaşırsınız. Sağlık ve beslenme konularında bilinçlisinizdir; sindirim sistemi hassastır. Harita yöneticiniz Merkür’dür.',
  'Yükselen Terazi: Zarif, nazik ve sosyal bir ilk izleniminiz vardır. İnsanlarla kolay ilişki kurar, ortamı yumuşatırsınız. Hayatı ilişkiler üzerinden deneyimlersiniz; karar vermek için başkalarının görüşüne ihtiyaç duyabilirsiniz. Harita yöneticiniz Venüs’tür.',
  'Yükselen Akrep: Güçlü, gizemli ve yoğun bir aura taşırsınız; bakışlarınız etkileyicidir. Kendinizi kolay açmaz, önce gözlemlersiniz. Hayatınızda kriz ve dönüşüm temaları belirgindir. Geleneksel yönetici Mars, modern yönetici Plüton’dur.',
  'Yükselen Yay: Açık, neşeli ve maceracı bir enerjiyle karşılanırsınız. Hayata geniş bir perspektiften, iyimserlikle yaklaşırsınız. Seyahat, eğitim ve yabancı kültürler hayatınızda önemli rol oynar. Harita yöneticiniz Jüpiter’dir.',
  'Yükselen Oğlak: Ciddi, olgun ve güvenilir bir ilk izlenim bırakırsınız; çoğu zaman yaşınızdan büyük görünürsünüz ve yıllar geçtikçe gençleşirsiniz. Hayata sorumlulukla ve hedef odaklı yaklaşırsınız. Kemikler, dizler ve dişler hassastır. Harita yöneticiniz Satürn’dür.',
  'Yükselen Kova: Farklı, özgün ve dostane bir izlenim bırakırsınız. Hayata bağımsız ve sorgulayıcı bir gözle bakarsınız. İnsanlarla kolay arkadaşlık kurar ama kişisel alanınızı korursunuz. Geleneksel yönetici Satürn, modern yönetici Uranüs’tür.',
  'Yükselen Balık: Yumuşak, rüya gibi ve empatik bir izlenim bırakırsınız; gözleriniz anlamlıdır. Ortama kolay uyum sağlar, başkalarının beklentilerine göre şekil alabilirsiniz. Sınırlarınızı korumak önemlidir. Geleneksel yönetici Jüpiter, modern yönetici Neptün’dür.'
];
TX.MC = [
  'MC Koç: Kariyerde bağımsızlık, öncülük ve rekabet isteği öne çıkar. Kendi işinizi kurmak, liderlik etmek ya da hızlı karar gerektiren alanlar size uygundur.',
  'MC Boğa: Toplumsal hedefleriniz kalıcı değer, güven ve maddi istikrar üzerine kuruludur. Finans, sanat, tasarım, gıda ve doğa ile ilgili alanlar uygundur.',
  'MC İkizler: Kariyerinizde iletişim, yazı, öğretim, medya ve ticaret öne çıkar. Birden fazla rol üstlenebilir, hayat boyunca meslek değiştirebilirsiniz.',
  'MC Yengeç: Toplumsal rolünüzde bakım, koruma ve aidiyet teması vardır. Eğitim, sağlık, gayrimenkul, gıda ve aile işleri uygun alanlardır.',
  'MC Aslan: Görünür olmak, yaratmak ve yönetmek istersiniz. Sanat, sahne, yöneticilik ve çocuklarla ilgili alanlarda parlayabilirsiniz.',
  'MC Başak: Uzmanlık, ustalık ve hizmet kariyerinizin anahtarıdır. Sağlık, analiz, editörlük, zanaat ve sistem kurma alanları uygundur.',
  'MC Terazi: Kariyerinizde ilişki kurma, arabuluculuk ve estetik öne çıkar. Hukuk, danışmanlık, diplomasi ve tasarım uygun alanlardır.',
  'MC Akrep: Derinlik, araştırma ve güç gerektiren alanlarda başarılı olursunuz: psikoloji, finans, tıp, araştırma ve kriz yönetimi.',
  'MC Yay: Kariyerinizde anlam, öğretme ve genişleme ararsınız. Akademi, yayıncılık, hukuk, seyahat ve uluslararası işler uygundur.',
  'MC Oğlak: Toplumsal statü ve somut başarı sizin için önemlidir. Yönetim, kurum kurma ve uzun vadeli kariyer basamakları size göredir.',
  'MC Kova: Yenilikçi, insancıl ve teknolojik alanlarda kariyer yapmaya yatkınsınız. Topluluklar, sivil toplum, bilim ve teknoloji öne çıkar.',
  'MC Balık: Kariyerinizde ilham, şefkat ve hayal gücü önemlidir. Sanat, müzik, film, şifa, sosyal hizmet ve manevi alanlar uygundur.'
];
if (typeof module !== 'undefined') module.exports = TX;

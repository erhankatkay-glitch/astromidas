/* Sinastri alanları, solar return ve transit yılı için astrolog metinleri. Özgün metinler. */
var TX = (typeof TX !== 'undefined') ? TX : {};
TX.AST2 = {
  // Sinastri ilişki alanları: hangi gezegen çiftleri bakılır + değerlendirme metinleri [yumuşak, net]
  SYN: [
    { k: 'cekim', n: 'Çekim ve tutku', pairs: [['Venus', 'Mars'], ['Mars', 'Mars'], ['Venus', 'Pluto'], ['Mars', 'Pluto'], ['Sun', 'Mars'], ['Moon', 'Mars'], ['Venus', 'Asc'], ['Mars', 'Asc']],
      good: ['Aranızda doğal ve sıcak bir çekim var; fiziksel ve duygusal yakınlık kendiliğinden akıyor.', 'Güçlü, akıcı bir çekim.'],
      mixed: ['Çekim güçlü ama dalgalı: tutkunun yanında zaman zaman sürtüşmeler de gelir; bu gerilim ilişkiyi canlı tutar.', 'Güçlü ama dalgalı çekim.'],
      hard: ['Aranızdaki çekim yoğun ve elektrikli; ama aynı yoğunluk kıskançlık, güç mücadelesi ve tartışmaya da dönüşebilir. Bu enerjiyi ortak bir hedefe yönlendirmek önemli.', 'Yoğun ve çatışmalı çekim.'],
      none: ['Çekim kendini doğrudan gezegen bağlarıyla değil, zamanla gelişen yakınlıkla gösteriyor; bu ilişki dostluk ve güven üzerine kurulabilir.', 'Doğrudan çekim bağı zayıf.'] },
    { k: 'duygu', n: 'Duygusal uyum ve güven', pairs: [['Moon', 'Moon'], ['Sun', 'Moon'], ['Moon', 'Venus'], ['Moon', 'Asc'], ['Moon', 'Jupiter'], ['Moon', 'Saturn'], ['Moon', 'Neptune']],
      good: ['Birbirinizin yanında kendinizi güvende hissediyorsunuz; duygusal ihtiyaçlarınızı sezgiyle anlıyorsunuz. Bu, uzun süreli bir bağın en sağlam temelidir.', 'Duygusal uyum güçlü.'],
      mixed: ['Duygusal olarak birbirinize yakınsınız, ama ihtiyaçlarınızı ifade etme biçimleriniz farklı; bazen anlaşılmamış hissedebilirsiniz. Açık konuşmak bağı derinleştirir.', 'Yakın ama farklı duygusal diller.'],
      hard: ['Duygusal ritimleriniz farklı; birinin ihtiyaç duyduğu yakınlık diğerine fazla ya da az gelebilir. Sabır ve karşılıklı şefkatle bu fark öğretici bir zenginliğe dönüşür.', 'Duygusal uyum emek istiyor.'],
      none: ['Duygusal bağ doğrudan açılardan çok, birlikte geçirilen zamanla örülüyor.', 'Duygusal bağ dolaylı.'] },
    { k: 'iletisim', n: 'İletişim ve zihinsel uyum', pairs: [['Mercury', 'Mercury'], ['Mercury', 'Sun'], ['Mercury', 'Moon'], ['Mercury', 'Venus'], ['Mercury', 'Jupiter'], ['Mercury', 'Saturn'], ['Mercury', 'Uranus']],
      good: ['Konuşmak kolay ve keyifli: birbirinizin fikirlerini çabuk anlıyor, birlikte düşünürken ilham buluyorsunuz.', 'İletişim akıcı.'],
      mixed: ['Sohbetleriniz canlı ama bazen birbirinizi yanlış anlayabilirsiniz; dinlemeye zaman ayırmak işe yarar.', 'İletişim canlı ama dikkat ister.'],
      hard: ['Düşünme ve konuşma biçimleriniz farklı; tartışmalar kolayca kişiselleşebilir. Önemli konuları sakin anlarda ve yazılı netlikle konuşmak ilişkiyi korur.', 'İletişimde sürtüşme var.'],
      none: ['Zihinsel bağ doğrudan açılarla belirgin değil; ortak ilgi alanları bu bağı güçlendirir.', 'Zihinsel bağ dolaylı.'] },
    { k: 'kalicilik', n: 'Bağlılık ve kalıcılık', pairs: [['Saturn', 'Sun'], ['Saturn', 'Moon'], ['Saturn', 'Venus'], ['Saturn', 'Mars'], ['Saturn', 'Asc'], ['Sun', 'Sun'], ['NNode', 'Sun'], ['NNode', 'Moon'], ['NNode', 'Venus']],
      good: ['İlişkide sağlam bir zemin ve sorumluluk duygusu var; zamanla güçlenen, kalıcı bağların imzası bu.', 'Kalıcılık potansiyeli yüksek.'],
      mixed: ['Bağlılık güçlü ama yer yer ağır gelebilir: biri diğerine sınır koyar, öğretir ya da kısıtlar. Bu dersler doğru taşındığında ilişkiyi olgunlaştırır.', 'Bağlılık güçlü ama yük de var.'],
      hard: ['Satürn bağları sınav niteliğinde: soğukluk, eleştiri ya da sorumluluk yükü hissedilebilir. Ama ilişki bu sınavlardan geçtiğinde nadir görülen bir dayanıklılık kazanır.', 'Sınav niteliğinde bağlar.'],
      none: ['Uzun vadeli bağlılık konusunda belirgin bir yapı işareti yok; kalıcılık daha çok iki kişinin bilinçli seçimine bağlı.', 'Yapısal bağ zayıf.'] },
    { k: 'buyume', n: 'Birlikte büyüme ve şans', pairs: [['Jupiter', 'Sun'], ['Jupiter', 'Moon'], ['Jupiter', 'Venus'], ['Jupiter', 'Mars'], ['Jupiter', 'Asc'], ['Jupiter', 'Jupiter']],
      good: ['Birbirinize cömertlik, iyimserlik ve fırsat getiriyorsunuz; birlikteyken dünyanız genişliyor.', 'Birlikte büyüme kolay.'],
      mixed: ['Birbirinizi büyütüyorsunuz ama zaman zaman fazla beklenti ya da aşırılık da olabilir; ölçüyü korumak iyi gelir.', 'Büyüme var, ölçü gerekli.'],
      hard: ['Jüpiter bağları abartı ve fazla vaat riski taşıyor; büyük planları gerçekçi adımlara bölmek önemli.', 'Abartı riski.'],
      none: ['Ortak şans ve büyüme temaları doğrudan açılarla belirgin değil; bunu birlikte kurmak size kalmış.', 'Belirgin büyüme bağı yok.'] },
    { k: 'donusum', n: 'Derinlik, dönüşüm ve özgürlük', pairs: [['Pluto', 'Sun'], ['Pluto', 'Moon'], ['Pluto', 'Venus'], ['Uranus', 'Sun'], ['Uranus', 'Moon'], ['Uranus', 'Venus'], ['Neptune', 'Sun'], ['Neptune', 'Venus']],
      good: ['İlişki ikinizi de derinden değiştiriyor ve özgürleştiriyor; birlikte daha sezgisel, daha cesur kişilere dönüşüyorsunuz.', 'Dönüştürücü ve ilham verici.'],
      mixed: ['İlişki hem büyüleyici hem sarsıcı: ani değişimler, yoğun duygular ya da idealize etme dönemleri olabilir. Gerçekçi kalmak bağı korur.', 'Hem büyüleyici hem sarsıcı.'],
      hard: ['Dış gezegen bağları güç mücadelesi, öngörülemezlik ya da hayal kırıklığı getirebilir. Bu ilişki güçlü bir dönüşüm okulu; bilinçle yaşandığında çok şey öğretir.', 'Zorlayıcı dönüşüm.'],
      none: ['İlişkinin temposu daha sakin ve öngörülebilir; büyük kırılmalar yerine istikrar öne çıkıyor.', 'Sakin tempo.'] }
  ],
  // Ev yerleşimlerinin ilişki için anlamı
  OVL: { 1: 'kişilik düzeyinde doğrudan dokunur', 4: 'ev ve aile hissi verir', 5: 'aşk, eğlence ve romantizm uyandırır', 7: 'ortaklık ve evlilik alanında yer açar; ilişkiyi ciddiyete taşır', 8: 'derin bağ, tutku ve ortak kaynak temalarını açar', 10: 'kariyer ve toplumsal hedefler konusunda yol gösterir', 12: 'ruhsal ve bilinçdışı düzeyde dokunur' },
  // Solar return: köşe evlerdeki gezegenlerin yıl teması
  SRANG: { 1: 'yıl kişisel bir başlangıç ve görünürlük yılı', 4: 'yılın merkezinde ev, aile ve iç dünya var', 7: 'ilişkiler ve ortaklıklar yılın ana sahnesi', 10: 'kariyer ve toplumsal hedefler yılın ana sahnesi' },
  // Transit yılı dönem başlıkları
  Q: ['İlk çeyrek', 'İkinci çeyrek', 'Üçüncü çeyrek', 'Son çeyrek']
};

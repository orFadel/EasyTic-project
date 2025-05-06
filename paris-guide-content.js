document.addEventListener('DOMContentLoaded', function() {
    // מאזיני אירועים לכרטיסיות
    const guideCards = document.querySelectorAll('.guide-card');
    
    // נתונים מקוריים של כל מודול תוכן
    const contentModules = {
      'general-info': {
        title: 'מידע כללי על פריז',
        icon: 'fas fa-city',
        content: `
          <div class="general-info-content">
            <p>פריז היא בירת צרפת ואחת הערים המתוירות ביותר בעולם, המכונה "עיר האורות". היא ידועה בתרבותה העשירה, באתרי התיירות המפורסמים, באוכל המשובח ובאופנה. פריז שוכנת על גדות נהר הסיין ובה כ-2.2 מיליון תושבים.</p>
            
            <div class="info-grid">
              <div class="info-card">
                <i class="fas fa-map-marker-alt"></i>
                <h4>מיקום</h4>
                <p>צפון צרפת, על גדות נהר הסיין</p>
              </div>
              <div class="info-card">
                <i class="fas fa-language"></i>
                <h4>שפה</h4>
                <p>צרפתית (רשמית), אנגלית (נפוצה באזורי תיירות)</p>
              </div>
              <div class="info-card">
                <i class="fas fa-cross"></i>
                <h4>דת</h4>
                <p>נצרות קתולית (עיקרית), אך קיימים מגוון דתות ואמונות</p>
              </div>
              <div class="info-card">
                <i class="fas fa-thermometer-half"></i>
                <h4>אקלים</h4>
                <p>ממוזג, קיץ נעים (20-25°C) וחורף קריר (1-7°C)</p>
              </div>
            </div>
            
            <h3>עונות מומלצות לביקור</h3>
            <div class="info-grid">
              <div class="info-card">
                <i class="fas fa-sun"></i>
                <h4>אביב (אפריל-יוני)</h4>
                <p><strong>מזג אוויר:</strong> נעים (15-20°C)</p>
                <p><strong>יתרונות:</strong> פריחה בגנים, פחות תיירים מהקיץ, אווירה רומנטית</p>
              </div>
              <div class="info-card">
                <i class="fas fa-umbrella-beach"></i>
                <h4>קיץ (יולי-אוגוסט)</h4>
                <p><strong>מזג אוויר:</strong> חמים ונעים (20-25°C)</p>
                <p><strong>יתרונות:</strong> ימים ארוכים, אירועים ופסטיבלים רבים, חוף נהר הסיין פעיל</p>
              </div>
              <div class="info-card">
                <i class="fas fa-leaf"></i>
                <h4>סתיו (ספטמבר-נובמבר)</h4>
                <p><strong>מזג אוויר:</strong> נעים עד קריר (10-18°C)</p>
                <p><strong>יתרונות:</strong> צבעי שלכת מרהיבים, פחות תיירים, מחירים נוחים יותר</p>
              </div>
              <div class="info-card">
                <i class="fas fa-snowflake"></i>
                <h4>חורף (דצמבר-מרץ)</h4>
                <p><strong>מזג אוויר:</strong> קריר (1-7°C)</p>
                <p><strong>יתרונות:</strong> אווירת חגים, תאורת חג מולד, פחות עומס בתור לאטרקציות</p>
              </div>
            </div>
          </div>
        `
      },
      'travel-tips': {
        title: 'טיפים למטיילים',
        icon: 'fas fa-plane',
        content: `
          <div class="travel-tips-content">
            <div class="two-columns">
              <div class="tip-section">
                <h3><i class="fas fa-passport"></i> ויזה וכניסה</h3>
                <p>אזרחי ישראל אינם צריכים ויזה לביקור בצרפת/פריז לתקופה של עד 90 יום, במסגרת הסכם שנגן.</p>
                <ul>
                  <li>דרכון בתוקף ל-6 חודשים לפחות מיום היציאה מצרפת</li>
                  <li>כרטיס טיסה הלוך ושוב</li>
                  <li>הוכחת מקום לינה</li>
                  <li>מספיק כסף לשהייה (כ-120 יורו ליום)</li>
                </ul>
              </div>
              
              <div class="tip-section">
                <h3><i class="fas fa-coins"></i> כסף ועלויות</h3>
                <p><strong>מטבע:</strong> יורו (€). 1 יורו שווה לערך 4 ש"ח (נכון לאפריל 2025).</p>
                <p><strong>עלויות משוערות:</strong></p>
                <ul>
                  <li><i class="fas fa-hotel"></i> לינה: החל מ-120 יורו ללילה (מלון 3 כוכבים) ועד 400+ יורו (מלון יוקרה)</li>
                  <li><i class="fas fa-utensils"></i> ארוחה: 15-25 יורו (מסעדה בינונית), 40-100 יורו (מסעדה יוקרתית)</li>
                  <li><i class="fas fa-train"></i> נסיעה במטרו: 1.90 יורו לכיוון, כרטיסיית 10 נסיעות - 16.90 יורו</li>
                  <li><i class="fas fa-taxi"></i> מונית: פתיחת מונה כ-3 יורו + כ-1.5 יורו לק"מ</li>
                </ul>
              </div>
            </div>
            
            <div class="tip-section">
              <h3><i class="fas fa-hands"></i> התנהגות ותרבות</h3>
              <p>הצרפתים מעריכים נימוסים בסיסיים ומעט ידע של השפה המקומית:</p>
              <ul>
                <li><strong>שפה:</strong> מומלץ לדעת כמה מילים בסיסיות בצרפתית כמו "בונז'ור" (שלום), "מרסי" (תודה) ו"סיל וו פלה" (בבקשה). הצרפתים מעריכים מאמץ גם אם אתם ממשיכים באנגלית.</li>
                <li><strong>יחס לתיירים:</strong> בניגוד לסטריאוטיפ, רוב הפריזאים ידידותיים לתיירים. יחס מנומס והכרת כמה מילים בצרפתית יכולים לעשות את ההבדל.</li>
                <li><strong>תשרים:</strong> בדרך כלל כלול בחשבון כ-"Service Compris" אבל מקובל להשאיר 5-10% אם השירות היה טוב.</li>
                <li><strong>בטיחות:</strong> פריז היא עיר בטוחה יחסית, אך היו ערניים לכייסים באזורי תיירות מרכזיים ותחנות מטרו עמוסות.</li>
              </ul>
            </div>
          </div>
        `
      },
      'shopping': {
        title: 'קניות ובילויים',
        icon: 'fas fa-shopping-bag',
        content: `
          <div class="shopping-content">
            <h3>אזורי קניות מרכזיים</h3>
            <div class="info-grid">
              <div class="info-card">
                <img src="/parisPictures/parisGuide/elize.jpeg" alt="שאנז אליזה" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>שאנז אליזה</h4>
                <p>השדרה המפורסמת ביותר בפריז ואחת היקרות בעולם, עם חנויות יוקרה, מסעדות וקולנוע.</p>
              </div>
              
              <div class="info-card">
                <img src="/parisPictures/parisGuide/galeryLap.jpeg" alt="גלרי לאפאייט" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>גלרי לאפאייט</h4>
                <p>כלבו יוקרתי עם כיפת זכוכית מרהיבה, עם מחלקות רבות המציעות מותגי יוקרה ואופנה.</p>
              </div>
              
              <div class="info-card">
                <img src="/parisPictures/parisGuide/laMara.jpeg" alt="לה מארה" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>לה מארה</h4>
                <p>שכונה היסטורית עם חנויות בוטיק, מעצבים עצמאיים, גלריות אמנות וחנויות וינטג'.</p>
              </div>
              
              <div class="info-card">
                <img src="/parisPictures/parisGuide/sanGerman.jpeg" alt="סן ז'רמן" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>סן ז'רמן דה פרה</h4>
                <p>אזור אופנתי עם חנויות מעצבים, בתי קפה אינטלקטואליים וחנויות ספרים ואמנות.</p>
              </div>
            </div>
            
            <h3><i class="fas fa-utensils"></i> גסטרונומיה צרפתית</h3>
            <div class="two-columns">
              <div>
                <h4>מאכלים מקומיים שחובה לטעום</h4>
                <ul>
                  <li><strong>קרואסון</strong> - מאפה חמאה שכבות קלאסי, מושלם לארוחת בוקר</li>
                  <li><strong>בגט</strong> - הלחם הצרפתי האייקוני עם קראסט פריך ותוך רך</li>
                  <li><strong>רטטוי</strong> - תבשיל ירקות מסורתי מדרום צרפת</li>
                  <li><strong>קונפי דה קנאר</strong> - ירך ברווז מבושל באיטיות בשומן עצמו</li>
                  <li><strong>מקרון</strong> - עוגיות שקדים צבעוניות ממולאות בקרם</li>
                </ul>
              </div>
              
              <div>
                <h4>בתי קפה וקונדיטוריות מומלצות</h4>
                <div class="info-grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));">
                  <div class="info-card" style="text-align: right;">
                    <h5>Ladurée</h5>
                    <p>קונדיטוריה מפורסמת הידועה במקרונים שלה</p>
                    <p><strong>מיקום:</strong> שאנז אליזה</p>
                  </div>
                  <div class="info-card" style="text-align: right;">
                    <h5>Café de Flore</h5>
                    <p>בית קפה היסטורי שהיה מקום מפגש לאינטלקטואלים</p>
                    <p><strong>מיקום:</strong> סן ז'רמן דה פרה</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
      },
      'events': {
        title: 'אירועים וחגים',
        icon: 'fas fa-calendar-day',
        content: `
          <div class="events-content">
            <h3>פסטיבלים ואירועים מרכזיים</h3>
            <div class="info-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
              <div class="info-card">
                <i class="fas fa-flag"></i>
                <h4>יום הבסטיליה</h4>
                <p><strong>מתי:</strong> 14 ביולי</p>
                <p>חג הלאום הצרפתי עם מצעד צבאי בשאנז אליזה, מופעי זיקוקים ואירועי רחוב.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-bicycle"></i>
                <h4>טור דה פראנס</h4>
                <p><strong>מתי:</strong> יולי</p>
                <p>מרוץ האופניים המפורסם בעולם, מסתיים בשאנז אליזה בפריז.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-palette"></i>
                <h4>לילה לבן (Nuit Blanche)</h4>
                <p><strong>מתי:</strong> אוקטובר</p>
                <p>פסטיבל אמנות לילי בו מוזיאונים, גלריות ואתרים ציבוריים פתוחים כל הלילה.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-holly-berry"></i>
                <h4>שווקי חג המולד</h4>
                <p><strong>מתי:</strong> דצמבר</p>
                <p>שווקים חגיגיים עם ביתנים, מלאכות יד, מאכלים ומשקאות חורפיים.</p>
              </div>
            </div>
            
            <h3>חגים ומועדים לאומיים</h3>
            <div class="info-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
              <div class="info-card">
                <i class="fas fa-champagne-glasses"></i>
                <h4>ראש השנה (Jour de l'An)</h4>
                <p><strong>מתי:</strong> 1 בינואר</p>
                <p>חגיגות ערב השנה החדשה בשאנז אליזה ובאזור מגדל אייפל.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-dove"></i>
                <h4>יום הניצחון באירופה</h4>
                <p><strong>מתי:</strong> 8 במאי</p>
                <p>יום זיכרון לסיום מלחמת העולם השנייה באירופה, עם טקסים רשמיים וצבאיים.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-music"></i>
                <h4>פסטיבל המוזיקה (Fête de la Musique)</h4>
                <p><strong>מתי:</strong> 21 ביוני</p>
                <p>חגיגת מוזיקה בכל רחבי העיר עם מופעים והופעות חינמיות.</p>
              </div>
            </div>
          </div>
        `
      },
      'transportation': {
        title: 'תחבורה בפריז',
        icon: 'fas fa-subway',
        content: `
          <div class="transportation-content">
            <div class="info-grid">
              <div class="info-card">
                <i class="fas fa-train"></i>
                <h4>מטרו פריז</h4>
                <p>רשת מטרו צפופה המכסה את כל אזורי העיר, עם 16 קווים ויותר מ-300 תחנות.</p>
                <ul>
                  <li><strong>שעות פעילות:</strong> 5:30-1:15 (חצות) בימי חול, עד 2:15 בסופי שבוע</li>
                  <li><strong>מחיר:</strong> כרטיס בודד 1.90 יורו, כרטיסייה של 10 נסיעות 16.90 יורו</li>
                  <li><strong>טיפ:</strong> רכשו כרטיס Paris Visite או Navigo Découverte לנסיעות מרובות</li>
                </ul>
              </div>
              
              <div class="info-card">
                <i class="fas fa-bus"></i>
                <h4>אוטובוסים</h4>
                <p>רשת אוטובוסים נרחבת המאפשרת צפייה בנופי העיר תוך כדי נסיעה.</p>
                <ul>
                  <li><strong>שעות פעילות:</strong> רוב הקווים פעילים 7:00-20:30, אוטובוסי לילה (Noctilien) פועלים בלילה</li>
                  <li><strong>מחיר:</strong> זהה למטרו, ניתן להשתמש באותם כרטיסים</li>
                </ul>
              </div>
              
              <div class="info-card">
                <i class="fas fa-taxi"></i>
                <h4>מוניות</h4>
                <p>מוניות בפריז ניתן לזהות לפי לוחית "Taxi Parisien" מוארת על הגג.</p>
                <ul>
                  <li><strong>מחיר:</strong> פתיחת מונה כ-3 יורו + כ-1.5 יורו לק"מ (מחיר גבוה יותר בלילה)</li>
                  <li><strong>טיפ:</strong> ניתן להזמין באפליקציות G7 או Uber</li>
                </ul>
              </div>
              
              <div class="info-card">
                <i class="fas fa-bicycle"></i>
                <h4>אופניים (Vélib')</h4>
                <p>מערכת שיתוף אופניים עירונית עם אלפי אופניים ותחנות עגינה ברחבי העיר.</p>
                <ul>
                  <li><strong>מחיר:</strong> החל מ-3 יורו ליום או 20 יורו לשבוע</li>
                  <li><strong>טיפ:</strong> קיימים גם אופניים חשמליים בתוספת מחיר</li>
                </ul>
              </div>
            </div>
          </div>
        `
      },
      'accommodation': {
        title: 'מקומות לינה',
        icon: 'fas fa-bed',
        content: `
          <div class="accommodation-content">
            <h3>אזורים מומלצים ללינה</h3>
            <div class="info-grid">
              <div class="info-card">
                <h4>הרובע הראשון והשני (Louvre & Opéra)</h4>
                <p><strong>מתאים ל:</strong> מטיילים לראשונה בפריז, שופינג</p>
                <p><strong>אטרקציות קרובות:</strong> מוזיאון הלובר, גני טולרי, אופרה גרנייה</p>
                <p><strong>תקציב:</strong> גבוה</p>
              </div>
              
              <div class="info-card">
                <h4>הרובע ה-3 וה-4 (Le Marais)</h4>
                <p><strong>מתאים ל:</strong> אוהבי אווירה אותנטית, חיי לילה</p>
                <p><strong>אטרקציות קרובות:</strong> מרכז פומפידו, נוטרדאם, פלייס דה ווז'</p>
                <p><strong>תקציב:</strong> בינוני-גבוה</p>
              </div>
              
              <div class="info-card">
                <h4>הרובע ה-5 (הרובע הלטיני)</h4>
                <p><strong>מתאים ל:</strong> סטודנטים, מטיילים בתקציב, אווירה צעירה</p>
                <p><strong>אטרקציות קרובות:</strong> הפנתיאון, גני לוקסמבורג, אוניברסיטת סורבון</p>
                <p><strong>תקציב:</strong> בינוני</p>
              </div>
              
              <div class="info-card">
                <h4>הרובע ה-6 (סן ז'רמן דה פרה)</h4>
                <p><strong>מתאים ל:</strong> אוהבי תרבות ואמנות, אווירה אופנתית</p>
                <p><strong>אטרקציות קרובות:</strong> בתי קפה היסטוריים, גלריות, חנויות ספרים</p>
                <p><strong>תקציב:</strong> גבוה</p>
              </div>
              
              <div class="info-card">
                <h4>הרובע ה-18 (מונמארטר)</h4>
                <p><strong>מתאים ל:</strong> חובבי אמנות, אווירה בוהמית</p>
                <p><strong>אטרקציות קרובות:</strong> בזיליקת סקרה-קר, כיכר הציירים, מולאן רוז'</p>
                <p><strong>תקציב:</strong> בינוני</p>
              </div>
            </div>
            
            <h3>טיפים להזמנת מלון בפריז</h3>
            <ul>
              <li><strong>גודל חדרים:</strong> חדרי מלון בפריז נוטים להיות קטנים יחסית לסטנדרטים בינלאומיים, במיוחד במלונות ותיקים.</li>
              <li><strong>עונתיות:</strong> המחירים גבוהים במיוחד באפריל-יוני וספטמבר-אוקטובר. הנחות משמעותיות ניתן למצוא בחורף (למעט תקופת חגי סוף השנה).</li>
              <li><strong>דירוג כוכבים:</strong> דירוג המלונות בצרפת אמין יחסית. שימו לב שמלונות 4-5 כוכבים עשויים להיות יקרים מאוד.</li>
              <li><strong>מס עירוני:</strong> קיים מס תיירות שלא תמיד כלול במחיר המוצג באתרי הזמנות (בין 0.65 ל-5 יורו ללילה לאדם, תלוי בדירוג המלון).</li>
            </ul>
          </div>
        `
      },
      'photo-spots': {
        title: 'מקומות מומלצים לצילום',
        icon: 'fas fa-camera',
        content: `
          <div class="photo-spots-content">
            <div class="info-grid">
              <div class="info-card">
                <img src="/parisPictures/parisGuide/trucardo.jpeg" alt="טרוקדרו" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>כיכר טרוקדרו</h4>
                <p><strong>טיפ:</strong> המקום הטוב ביותר לצילום מגדל אייפל במלואו. מומלץ להגיע בשעות הבוקר המוקדמות לפני התיירים או בשקיעה.</p>
              </div>
              
              <div class="info-card">
                <img src="/parisPictures/parisGuide/alex3.jpeg" alt="גשר אלכסנדר השלישי" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>גשר אלכסנדר השלישי</h4>
                <p><strong>טיפ:</strong> הגשר המעוטר ביותר בפריז מציע נופים מרהיבים של נהר הסיין, מגדל אייפל ואנווליד. מומלץ בשעת שקיעה או לילה.</p>
              </div>
              
              <div class="info-card">
                <img src="/parisPictures/parisGuide/munmarter.jpeg" alt="מונמארטר" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>מדרגות מונמארטר</h4>
                <p><strong>טיפ:</strong> המדרגות המובילות לסקרה-קר מציעות נוף פנורמי של פריז. צלמו בשעות אחר הצהריים לתאורה מחמיאה.</p>
              </div>
              
              <div class="info-card">
                <img src="/parisPictures/parisGuide/cremieux.jpeg" alt="רחוב קרמייה" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>רחוב קרמייה (Rue Crémieux)</h4>
                <p><strong>טיפ:</strong> רחוב קטן וציורי עם בתים צבעוניים. מומלץ להגיע בבוקר או בצהריים כשהשמש מאירה את הבתים.</p>
              </div>
              
              <div class="info-card">
                <img src="/parisPictures/parisGuide/luverPiramid.jpeg" alt="פירמידת הלובר" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>פירמידת הלובר</h4>
                <p><strong>טיפ:</strong> צלמו את הפירמידה בשעות הערב כשהיא מוארת, או השתמשו בפירמידות הקטנות כמסגרת לפירמידה הגדולה.</p>
              </div>
            </div>
          </div>
        `
      },
      'checklist': {
        title: 'צ\'ק ליסט לטיול בפריז',
        icon: 'fas fa-check-circle',
        content: `
          <div class="checklist-content">
            <p>רשימת הכנות חשובות לפני היציאה לטיול בפריז:</p>
            
            <div class="checklist-container">
              <div class="checklist-item">
                <input type="checkbox" id="check1">
                <label for="check1">דרכון בתוקף (לפחות 6 חודשים)</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check2">
                <label for="check2">כרטיסי טיסה הלוך ושוב</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check3">
                <label for="check3">אישור שהייה במלון</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check4">
                <label for="check4">ביטוח נסיעות</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check5">
                <label for="check5">מתאם חשמל (בצרפת משתמשים בשקעים אירופאיים Type E/F)</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check6">
                <label for="check6">כסף מקומי (יורו) או כרטיס אשראי בינלאומי</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check7">
                <label for="check7">כרטיסים לאטרקציות מרכזיות (מומלץ להזמין מראש)</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check8">
                <label for="check8">מילון בסיסי או אפליקציית תרגום</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check9">
                <label for="check9">הורדת אפליקציות שימושיות (RATP לתחבורה, Google Maps, Paris Metro)</label>
              </div>
            </div>
            
            <div class="final-tips">
              <h3><i class="fas fa-star"></i> טיפים אחרונים לפני היציאה</h3>
              <ul>
                <li>לבוש - פריזאים מתלבשים בסגנון אלגנטי יחסית. קחו בגדים בצבעים ניטרליים שניתן לשלב בקלות.</li>
                <li>נעליים נוחות חיוניות - פריז היא עיר שכדאי לטייל בה ברגל, אך המדרכות עשויות מאבן ולא תמיד נוחות.</li>
                <li>בקיץ - כובע, משקפי שמש וקרם הגנה הכרחיים.</li>
                <li>בחורף - מעיל חם, צעיף וכפפות כי הטמפרטורות יכולות להיות נמוכות מאוד.</li>
                <li>שמרו על העתקים של מסמכים חשובים (דרכון, ביטוח) בנפרד מהמקור ובדיגיטל.</li>
              </ul>
            </div>
          </div>
        `
      },
      'kosher': {
        title: 'אוכל כשר בפריז',
        icon: 'fas fa-utensils',
        content: `
          <div class="kosher-content">
            <h3><i class="fas fa-star-of-david"></i> מסעדות כשרות בפריז</h3>
            <p>פריז היא אחת הערים באירופה עם מבחר גדול של מסעדות כשרות, בעיקר בשל הקהילה היהודית הגדולה בעיר. הנה רשימה של מסעדות כשרות מומלצות בפריז:</p>
            
            <div class="info-grid">
              <div class="info-card">
                <h4>L'As du Fallafel</h4>
                <p><strong>סגנון:</strong> מזרח תיכוני</p>
                <p><strong>כשרות:</strong> בהשגחת הרבנות המקומית</p>
                <p><strong>מיקום:</strong> רובע המארה, הרובע היהודי ההיסטורי</p>
                <p><strong>מחיר:</strong> ₪₪ (בינוני)</p>
                <p><strong>טיפ:</strong> ידוע בפלאפל שלו, יש תורים ארוכים בשעות העומס</p>
              </div>
              
              <div class="info-card">
                <h4>Le Marais</h4>
                <p><strong>סגנון:</strong> צרפתי</p>
                <p><strong>כשרות:</strong> גלאט כשר</p>
                <p><strong>מיקום:</strong> Avenue Rachel, קרוב למונמארטר</p>
                <p><strong>מחיר:</strong> ₪₪₪ (בינוני-גבוה)</p>
                <p><strong>טיפ:</strong> מומלץ להזמין מקום מראש</p>
              </div>
              
              <div class="info-card">
                <h4>Darjeeling</h4>
                <p><strong>סגנון:</strong> הודי</p>
                <p><strong>כשרות:</strong> בהשגחת בית דין פריז</p>
                <p><strong>מיקום:</strong> קרוב לשאנז אליזה</p>
                <p><strong>מחיר:</strong> ₪₪₪ (בינוני-גבוה)</p>
                <p><strong>טיפ:</strong> מבחר טבעוני וצמחוני איכותי</p>
              </div>
              
              <div class="info-card">
                <h4>Kavod</h4>
                <p><strong>סגנון:</strong> צרפתי-מרוקאי</p>
                <p><strong>כשרות:</strong> גלאט כשר למהדרין</p>
                <p><strong>מיקום:</strong> שכונת ה-19</p>
                <p><strong>מחיר:</strong> ₪₪ (בינוני)</p>
                <p><strong>טיפ:</strong> מומלץ במיוחד לארוחת שבת</p>
              </div>
            </div>
            
            <h3><i class="fas fa-shopping-basket"></i> מוצרים כשרים בפריז</h3>
            <p>ניתן למצוא מוצרים כשרים במקומות הבאים:</p>
            <ul>
              <li><strong>Charles Traiteur</strong> - מעדנייה כשרה ידועה</li>
              <li><strong>Korcarz</strong> - מאפייה כשרה מפורסמת</li>
              <li><strong>Franprix & Monoprix</strong> - רשתות סופרמרקט עם מחלקות כשרות בסניפים מסוימים</li>
              <li><strong>מרכולים ברובע ה-19</strong> - אזור עם אוכלוסייה יהודית גדולה</li>
            </ul>
            
            <h3><i class="fas fa-synagogue"></i> בתי כנסת ומרכזים יהודיים</h3>
            <ul>
              <li><strong>בית הכנסת הגדול של פריז</strong> - Rue de la Victoire, מבנה מרשים משנת 1874</li>
              <li><strong>מרכז רש"י</strong> - מרכז יהודי עם ספרייה, הרצאות ואירועים</li>
              <li><strong>בית חב"ד</strong> - מספר סניפים ברחבי העיר, מספקים מידע, ארוחות שבת ושירותים נוספים</li>
            </ul>
            
            <div class="info-note">
              <p><strong>שימו לב:</strong> המידע לגבי כשרות עשוי להשתנות. מומלץ לבדוק את סטטוס הכשרות לפני ההגעה.</p>
            </div>
          </div>
        `
      }
    };

    createContentSections();
    
    // הוספת מאזיני אירועים לכרטיסיות
    guideCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardType = this.getAttribute('data-card');
            toggleContent(cardType, this);
        });
    });
    
    // פונקציה ליצירת אזורי תוכן
    function createContentSections() {
        const container = document.querySelector('.guide-cards-container');
        
        // נצטרך למצוא את כל צמדי הקוביות והתוכן שלהן
        let cardPairs = [];
        
        // ראשית, ניצור מערך של כל הקוביות
        guideCards.forEach(card => {
            const cardType = card.getAttribute('data-card');
            cardPairs.push({
                card: card,
                type: cardType
            });
        });
        
        // נעבור על כל הקוביות ונוסיף אחרי כל אחת את התוכן שלה
        for (let i = 0; i < cardPairs.length; i++) {
            const pair = cardPairs[i];
            const module = contentModules[pair.type];
            
            if (module) {
                // יצירת אזור תוכן
                const contentDiv = document.createElement('div');
                contentDiv.id = `content-${pair.type}`;
                contentDiv.className = 'guide-content-section';
                contentDiv.style.display = 'none'; // מוסתר כברירת מחדל
                contentDiv.innerHTML = `
                    <div class="guide-content-inner">
                        <h2><i class="${module.icon}"></i> ${module.title}</h2>
                        ${module.content}
                    </div>
                `;
                
                // הוספת אזור התוכן אחרי הקוביה המתאימה
                pair.card.insertAdjacentElement('afterend', contentDiv);
            }
        }
    }
    
    // פונקציה להחלפת התוכן המוצג
    function toggleContent(contentType, clickedCard) {
        // מציאת אזור התוכן הרלוונטי
        const contentSection = document.getElementById(`content-${contentType}`);
        
        // בדיקה אם אזור התוכן כבר מוצג
        const isVisible = contentSection.style.display === 'block';
        
        // עדכון סגנון הכרטיסיות
        guideCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // הסתרת כל אזורי התוכן
        document.querySelectorAll('.guide-content-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // אם אזור התוכן לא היה מוצג, מציגים אותו
        if (!isVisible) {
            clickedCard.classList.add('active');
            contentSection.style.display = 'block';
            
            // גלילה חלקה אל התוכן
            setTimeout(() => {
                contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
    
    // פונקציה גלובלית לגלילה למעלה
    window.scrollToTop = function() {
        const guideSection = document.querySelector('.paris-guide-section');
        guideSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
});
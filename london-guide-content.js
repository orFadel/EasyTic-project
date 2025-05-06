document.addEventListener('DOMContentLoaded', function() {
    // מאזיני אירועים לכרטיסיות
    const guideCards = document.querySelectorAll('.guide-card');
    
    // נתונים מקוריים של כל מודול תוכן
    const contentModules = {
      'general-info': {
        title: 'מידע כללי על לונדון',
        icon: 'fas fa-city',
        content: `
          <div class="general-info-content">
            <p>לונדון היא בירת אנגליה והעיר הגדולה ביותר בממלכה המאוחדת. מעבר להיותה מרכז פוליטי ועסקי, לונדון היא אחת הערים התיירותיות המובילות בעולם, המפורסמת באתריה ההיסטוריים, המוזיאונים העשירים, התיאטראות והאטרקציות המגוונות.</p>
            
            <div class="info-grid">
              <div class="info-card">
                <i class="fas fa-map-marker-alt"></i>
                <h4>מיקום</h4>
                <p>דרום מזרח אנגליה, על גדות נהר התמזה</p>
              </div>
              <div class="info-card">
                <i class="fas fa-language"></i>
                <h4>שפה</h4>
                <p>אנגלית (רשמית), מגוון רחב של שפות נוספות</p>
              </div>
              <div class="info-card">
                <i class="fas fa-pound-sign"></i>
                <h4>מטבע</h4>
                <p>פאונד בריטי (£)</p>
              </div>
              <div class="info-card">
                <i class="fas fa-thermometer-half"></i>
                <h4>אקלים</h4>
                <p>מתון וגשום, עם ארבע עונות מובחנות</p>
              </div>
            </div>
            
            <h3>עונות מומלצות לביקור</h3>
            <div class="info-grid">
              <div class="info-card">
                <i class="fas fa-sun"></i>
                <h4>אביב (מרץ-מאי)</h4>
                <p><strong>מזג אוויר:</strong> נעים (10-17°C)</p>
                <p><strong>יתרונות:</strong> פריחה בפארקים, פחות תיירים מהקיץ</p>
              </div>
              <div class="info-card">
                <i class="fas fa-temperature-high"></i>
                <h4>קיץ (יוני-אוגוסט)</h4>
                <p><strong>מזג אוויר:</strong> חמים (15-25°C)</p>
                <p><strong>יתרונות:</strong> ימים ארוכים, אירועי חוצות רבים</p>
              </div>
              <div class="info-card">
                <i class="fas fa-leaf"></i>
                <h4>סתיו (ספטמבר-נובמבר)</h4>
                <p><strong>מזג אוויר:</strong> מתקרר (8-18°C)</p>
                <p><strong>יתרונות:</strong> צבעי שלכת יפים, פחות עומס</p>
              </div>
              <div class="info-card">
                <i class="fas fa-snowflake"></i>
                <h4>חורף (דצמבר-פברואר)</h4>
                <p><strong>מזג אוויר:</strong> קר (2-10°C)</p>
                <p><strong>יתרונות:</strong> אווירת חגים, מחירים נמוכים יותר</p>
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
                <p>אזרחי ישראל אינם צריכים ויזה לביקור תיירותי בבריטניה לתקופה של עד 6 חודשים. עם זאת, יש להציג את המסמכים הבאים בהגעה:</p>
                <ul>
                  <li>דרכון בתוקף לפחות 6 חודשים מיום היציאה</li>
                  <li>כרטיס טיסה הלוך ושוב</li>
                  <li>הוכחת מקום לינה</li>
                  <li>הוכחת אמצעים כספיים לשהייה</li>
                </ul>
              </div>
              
              <div class="tip-section">
                <h3><i class="fas fa-coins"></i> כסף ועלויות</h3>
                <p><strong>מטבע:</strong> פאונד בריטי (£). שער חליפין משתנה, אך בדרך כלל £1 שווה לערך 4.5-5 ש"ח (נכון לאפריל 2025).</p>
                <p><strong>עלויות משוערות:</strong></p>
                <ul>
                  <li><i class="fas fa-hotel"></i> לינה: החל מ-400 ש"ח ללילה (הוסטל) ועד 1,500+ ש"ח (מלון איכותי)</li>
                  <li><i class="fas fa-utensils"></i> ארוחה: 50-100 ש"ח (מזון מהיר), 150-300 ש"ח (מסעדה בינונית)</li>
                  <li><i class="fas fa-train"></i> נסיעה בתחבורה ציבורית: 10-20 ש"ח לכיוון</li>
                  <li><i class="fas fa-taxi"></i> מונית: פתיחת מונה כ-15 ש"ח + כ-8 ש"ח לק"מ</li>
                </ul>
              </div>
            </div>
            
            <div class="tip-section">
              <h3><i class="fas fa-plug"></i> חשמל ותקשורת</h3>
              <p><strong>שקעי חשמל:</strong> בבריטניה משתמשים בשקעים מסוג G (שלושה פינים מלבניים). יש להצטייד במתאם מתאים.</p>
              <p><strong>אינטרנט:</strong> Wi-Fi זמין ברוב בתי המלון, מסעדות ומקומות ציבוריים. ניתן גם לרכוש כרטיס SIM מקומי לגלישה.</p>
            </div>
            
            <div class="tip-section">
              <h3><i class="fas fa-umbrella"></i> טיפים כלליים</h3>
              <ul>
                <li><strong>מזג אוויר:</strong> יש להתכונן לאפשרות של גשם בכל עונות השנה. מומלץ לקחת מטריה או מעיל גשם.</li>
                <li><strong>טיפים:</strong> מקובל להשאיר טיפ של 10-15% במסעדות, אך בדקו שלא נכלל כבר בחשבון.</li>
                <li><strong>חצייה בכבישים:</strong> זכרו שבבריטניה נוהגים בצד שמאל, ולכן יש להסתכל לימין ואז לשמאל בחציית כבישים.</li>
                <li><strong>אדיבות:</strong> הבריטים ידועים באדיבותם. הקפידו על המילים "please" ו-"thank you".</li>
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
            <h3>רחובות וקניונים מרכזיים</h3>
            <div class="info-grid">
              <div class="info-card">
                <img src="/londonPictures/londonGuide/oxfordStreet.jpeg" alt="אוקספורד סטריט" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>אוקספורד סטריט</h4>
                <p>רחוב הקניות המפורסם ביותר בלונדון, עם מאות חנויות ומותגים מקומיים ובינלאומיים.</p>
              </div>
              
              <div class="info-card">
                <img src="/londonPictures/londonGuide/coventGarden.jpeg" alt="קובנט גארדן" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>קובנט גארדן</h4>
                <p>אזור קניות מקסים עם חנויות ייחודיות, בוטיקים, שווקים ואווירה היסטורית.</p>
              </div>
              
              <div class="info-card">
                <img src="/londonPictures/londonGuide/harrods.jpeg" alt="הרודס" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>הרודס</h4>
                <p>חנות הכלבו המפורסמת ביותר בעולם, מציעה מגוון עצום של מוצרי יוקרה.</p>
              </div>
              
              <div class="info-card">
                <img src="/londonPictures/londonGuide/camdenMarket.jpeg" alt="שוק קמדן" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>שוק קמדן</h4>
                <p>שוק צבעוני ותוסס המציע אופנה, אמנות, אוכל ומזכרות ייחודיות באווירה אלטרנטיבית.</p>
              </div>
            </div>
            
            <h3><i class="fas fa-utensils"></i> קולינריה בריטית</h3>
            <div class="two-columns">
              <div>
                <h4>מאכלים מקומיים שחובה לטעום</h4>
                <ul>
                  <li><strong>Fish and Chips</strong> - דג בציפוי פריך מוגש עם צ'יפס</li>
                  <li><strong>Full English Breakfast</strong> - ארוחת בוקר אנגלית מסורתית</li>
                  <li><strong>Sunday Roast</strong> - צלי בשר מסורתי עם תוספות</li>
                  <li><strong>Afternoon Tea</strong> - תה אחר הצהריים עם כריכים קטנים, סקונים וקינוחים</li>
                  <li><strong>Pie and Mash</strong> - פשטידה עם פירה תפוחי אדמה</li>
                </ul>
              </div>
              
              <div>
                <h4>פאבים מסורתיים</h4>
                <p>ביקור בלונדון אינו שלם ללא כניסה לפאב מסורתי. הפאבים הם מוסד תרבותי בבריטניה, המציעים לא רק משקאות אלא גם אוכל טוב ואווירה חמה. מומלץ לנסות בירות מקומיות כמו Ale או Stout.</p>
                <p><strong>רשת פאבים מומלצת:</strong> Fuller's, Samuel Smith's, Wetherspoon</p>
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
                <i class="fas fa-crown"></i>
                <h4>חילופי המשמרות בארמון בקינגהאם</h4>
                <p><strong>מתי:</strong> יום יום באביב והקיץ, ימים אלטרנטיביים בחורף</p>
                <p>טקס צבאי מרשים המושך אלפי תיירים. בדקו מראש את זמני הטקס באתר הרשמי.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-theater-masks"></i>
                <h4>עונת התיאטרון בווסט אנד</h4>
                <p><strong>מתי:</strong> כל השנה</p>
                <p>לונדון נחשבת למרכז התיאטרון העולמי, עם עשרות הצגות, מחזות זמר והופעות בכל יום.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-music"></i>
                <h4>פרומס - סדרת קונצרטים בהייד פארק</h4>
                <p><strong>מתי:</strong> יולי-ספטמבר</p>
                <p>פסטיבל מוזיקה קלאסית יוקרתי המתקיים מדי קיץ עם הופעות רבות הפתוחות לקהל.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-dragon"></i>
                <h4>ראש השנה הסיני</h4>
                <p><strong>מתי:</strong> ינואר/פברואר (משתנה לפי הלוח הסיני)</p>
                <p>חגיגות צבעוניות וססגוניות ברובע סוהו וצ'יינה טאון עם תהלוכות, ריקודי דרקון ופעילויות רבות.</p>
              </div>
            </div>
            
            <h3>חגים בריטיים</h3>
            <div class="info-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
              <div class="info-card">
                <i class="fas fa-flag"></i>
                <h4>יום הולדת רשמי למלך/מלכה</h4>
                <p><strong>מתי:</strong> יוני</p>
                <p>חגיגות רשמיות עם מצעד צבאי מרשים ("Trooping the Colour") ומטס אווירי מעל ארמון בקינגהאם.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-ghost"></i>
                <h4>ליל כל הקדושים (Halloween)</h4>
                <p><strong>מתי:</strong> 31 באוקטובר</p>
                <p>חגיגות ותהלוכות ססגוניות עם תחפושות ואירועים מיוחדים ברחבי העיר.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-gift"></i>
                <h4>חג המולד</h4>
                <p><strong>מתי:</strong> 25 בדצמבר</p>
                <p>לונדון מתקשטת באורות חג מרהיבים, שווקי חג מולד, מופעי קרח ואווירה קסומה במיוחד.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-firework"></i>
                <h4>ליל גאי פוקס (Bonfire Night)</h4>
                <p><strong>מתי:</strong> 5 בנובמבר</p>
                <p>חגיגות עם זיקוקים ומדורות לציון סיכול מזימת אבק השריפה לפוצץ את הפרלמנט הבריטי ב-1605.</p>
              </div>
            </div>
          </div>
        `
      },
      'transportation': {
        title: 'תחבורה בלונדון',
        icon: 'fas fa-subway',
        content: `
          <div class="transportation-content">
            <div class="info-grid">
              <div class="info-card">
                <i class="fas fa-train"></i>
                <h4>הרכבת התחתית (Tube)</h4>
                <p>רשת הרכבת התחתית של לונדון היא הדרך המהירה והיעילה ביותר לנוע בעיר.</p>
                <ul>
                  <li><strong>שעות פעילות:</strong> 5:00-24:00 (בימי חול), שירות 24 שעות בסופ"ש בקווים נבחרים</li>
                  <li><strong>מחיר:</strong> כ-25-40 ש"ח לנסיעה בודדת (תלוי באזורים)</li>
                  <li><strong>טיפ:</strong> רכשו כרטיס Oyster או השתמשו בכרטיס אשראי contactless לחיסכון בעלויות</li>
                </ul>
              </div>
              
              <div class="info-card">
                <i class="fas fa-bus"></i>
                <h4>אוטובוסים</h4>
                <p>האוטובוסים האדומים הדו-קומתיים הם אייקון לונדוני ודרך מצוינת לראות את העיר.</p>
                <ul>
                  <li><strong>שעות פעילות:</strong> 24 שעות, עם קווי לילה רבים</li>
                  <li><strong>מחיר:</strong> כ-8-10 ש"ח לנסיעה בודדת (נסיעה שנייה בחינם תוך שעה)</li>
                  <li><strong>טיפ:</strong> קו 15 עובר דרך אתרים תיירותיים רבים</li>
                </ul>
              </div>
              
              <div class="info-card">
                <i class="fas fa-taxi"></i>
                <h4>מוניות (Black Cabs)</h4>
                <p>המוניות השחורות האייקוניות של לונדון מספקות שירות אמין אך יקר.</p>
                <ul>
                  <li><strong>מחיר:</strong> פתיחת מונה כ-15 ש"ח + כ-8 ש"ח לק"מ</li>
                  <li><strong>טיפ:</strong> מומלץ להשתמש באפליקציות כמו Uber, Bolt או FREE NOW לאופציות זולות יותר</li>
                </ul>
              </div>
              
              <div class="info-card">
                <i class="fas fa-bicycle"></i>
                <h4>אופניים להשכרה (Santander Cycles)</h4>
                <p>מערכת השכרת אופניים עירונית המציעה דרך בריאה וירוקה לחקור את העיר.</p>
                <ul>
                  <li><strong>מחיר:</strong> כ-10 ש"ח לגישה ל-24 שעות + תשלום לפי זמן נסיעה</li>
                  <li><strong>טיפ:</strong> הנסיעות הקצרות מ-30 דקות כלולות במחיר הגישה</li>
                </ul>
              </div>
            </div>
            
            <div class="tip-section">
              <h3><i class="fas fa-ticket-alt"></i> כרטיסי תחבורה</h3>
              <p><strong>Oyster Card:</strong> כרטיס חכם נטען לנסיעות ברכבת התחתית, אוטובוסים ורכבות עירוניות. מציע מחירים זולים יותר מכרטיסים בודדים ויש הגבלת תקרת מחיר יומית.</p>
              <p><strong>Contactless:</strong> ניתן להשתמש בכרטיסי אשראי עם טכנולוגיית contactless בדיוק כמו Oyster Card, עם אותם התעריפים והתקרות.</p>
              <p><strong>Travelcard:</strong> כרטיס לנסיעות בלתי מוגבלות לתקופה מוגדרת (יומי, שבועי וכו'). כדאי לתיירים שמתכננים נסיעות רבות.</p>
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
                <h4>סוהו ולסטר סקוור (Soho & Leicester Square)</h4>
                <p><strong>מתאים ל:</strong> אוהבי חיי לילה, תיאטרון, מסעדות</p>
                <p><strong>אטרקציות קרובות:</strong> תיאטראות הווסט אנד, צ'יינה טאון, פיקדילי</p>
                <p><strong>תקציב:</strong> גבוה</p>
              </div>
              
              <div class="info-card">
                <h4>קנסינגטון ונוטינג היל (Kensington & Notting Hill)</h4>
                <p><strong>מתאים ל:</strong> משפחות, זוגות, חובבי שקט</p>
                <p><strong>אטרקציות קרובות:</strong> מוזיאון הטבע, הייד פארק, פורטובלו רוד</p>
                <p><strong>תקציב:</strong> בינוני-גבוה</p>
              </div>
              
              <div class="info-card">
                <h4>קמדן (Camden)</h4>
                <p><strong>מתאים ל:</strong> צעירים, חובבי מוזיקה, אווירה אלטרנטיבית</p>
                <p><strong>אטרקציות קרובות:</strong> שוק קמדן, רג'נטס פארק, גן החיות של לונדון</p>
                <p><strong>תקציב:</strong> בינוני</p>
              </div>
              
              <div class="info-card">
                <h4>קינגס קרוס וסנט פנקרס (Kings Cross & St. Pancras)</h4>
                <p><strong>מתאים ל:</strong> מטיילים בתקציב, נוסעים ברכבת</p>
                <p><strong>אטרקציות קרובות:</strong> תחנת קינגס קרוס, הספרייה הבריטית, פלטפורמה 9¾</p>
                <p><strong>תקציב:</strong> נמוך-בינוני</p>
              </div>
            </div>
            
            <h3>טיפים להזמנת מלון בלונדון</h3>
            <ul>
              <li><strong>הזמנה מראש:</strong> לונדון היא יעד תיירותי פופולרי מאוד. הזמינו מקום לינה לפחות 2-3 חודשים מראש, במיוחד בעונת הקיץ ובחגים.</li>
              <li><strong>מיקום:</strong> בחרו מלון הקרוב לתחנת רכבת תחתית. הדבר יחסוך לכם זמן רב בנסיעות.</li>
              <li><strong>גודל חדרים:</strong> חדרי מלונות בלונדון נוטים להיות קטנים יחסית, במיוחד במלונות ותיקים במרכז העיר.</li>
              <li><strong>ארוחת בוקר:</strong> ארוחת בוקר במלונות בלונדון יכולה להיות יקרה. שקלו להוסיף אותה להזמנה מראש או לאכול בבתי קפה מקומיים.</li>
              <li><strong>מלונות לעומת דירות:</strong> עבור שהות ארוכה יותר, שקלו שכירת דירה באתרים כמו Airbnb, שעשויה להיות אופציה חסכונית יותר ומציעה חווית מגורים מקומית.</li>
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
                <img src="/londonPictures/londonGuide/towerBridge.jpeg" alt="גשר המצודה" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>גשר המצודה (Tower Bridge)</h4>
                <p><strong>טיפ:</strong> הנקודה הטובה ביותר לצילום היא מגדת הנהר ליד מצודת לונדון. נסו לצלם בשעת שקיעה לתאורה מושלמת.</p>
              </div>
              
              <div class="info-card">
                <img src="/londonPictures/londonGuide/londonEye.jpeg" alt="לונדון איי" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>לונדון איי (London Eye)</h4>
                <p><strong>טיפ:</strong> צלמו מגשר ווסטמינסטר או מגני ג'ובילי. העיתוי המושלם הוא בלילה כשהגלגל מואר.</p>
              </div>
              
              <div class="info-card">
                <img src="/londonPictures/londonGuide/nottingHill.jpeg" alt="נוטינג היל" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>בתים צבעוניים בנוטינג היל</h4>
                <p><strong>טיפ:</strong> טיילו ברחובות Portobello Road, Lancaster Road ו-Denbigh Terrace לבתים הצבעוניים המפורסמים.</p>
              </div>
              
              <div class="info-card">
                <img src="/londonPictures/londonGuide/stPual.jpeg" alt="קתדרלת סנט פול" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>קתדרלת סנט פול (St. Paul's Cathedral)</h4>
                <p><strong>טיפ:</strong> צלמו מגשר המילניום (Millennium Bridge) לקבלת תמונה אייקונית של הגשר והקתדרלה יחד.</p>
              </div>
            </div>
          </div>
        `
      },
      'checklist': {
        title: 'צ\'ק ליסט לטיול בלונדון',
        icon: 'fas fa-check-circle',
        content: `
          <div class="checklist-content">
            <p>רשימת הכנות חשובות לפני היציאה לטיול בלונדון:</p>
            
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
                <label for="check5">מתאם חשמל לשקעים בריטיים (Type G)</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check6">
                <label for="check6">המרת כסף לפאונד או כרטיס אשראי בינלאומי ללא עמלות</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check7">
                <label for="check7">כרטיסים לאטרקציות מרכזיות (מומלץ להזמין מראש)</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check8">
                <label for="check8">הורדת אפליקציות שימושיות (TfL Go לתחבורה, Citymapper למפות ועוד)</label>
              </div>
            </div>
            
            <div class="final-tips">
              <h3><i class="fas fa-star"></i> טיפים אחרונים לפני היציאה</h3>
              <ul>
                <li>קחו מטריה או מעיל גשם - מזג האוויר בלונדון יכול להשתנות במהירות.</li>
                <li>נעליים נוחות להליכה הן חובה - לונדון היא עיר גדולה ותצטרכו ללכת הרבה.</li>
                <li>למטיילים בתקציב: רוב המוזיאונים והגלריות המרכזיים בלונדון הם בחינם.</li>
                <li>שמרו על ערנות בנוגע לחפצים אישיים באזורים צפופים, כמו ברכבת התחתית ובאטרקציות תיירותיות.</li>
              </ul>
            </div>
          </div>
        `
      },
      'museums': {
        title: 'מוזיאונים ואתרי תרבות',
        icon: 'fas fa-landmark',
        content: `
          <div class="museums-content">
            <h3><i class="fas fa-university"></i> מוזיאונים מרכזיים בחינם</h3>
            <p>לונדון ידועה בכך שרוב המוזיאונים והגלריות הלאומיים שלה מציעים כניסה חופשית לתצוגות הקבע:</p>
            
            <div class="info-grid">
              <div class="info-card">
                <h4>המוזיאון הבריטי (British Museum)</h4>
                <p><strong>אוסף:</strong> אחד המוזיאונים המובילים בעולם לארכיאולוגיה והיסטוריה עם מיליוני פריטים, כולל אבן רוזטה ושיש אלגין.</p>
                <p><strong>מיקום:</strong> Great Russell Street</p>
                <p><strong>שעות פתיחה:</strong> 10:00-17:30, שישי עד 20:30</p>
              </div>
              
              <div class="info-card">
                <h4>הגלריה הלאומית (National Gallery)</h4>
                <p><strong>אוסף:</strong> למעלה מ-2,300 ציורים מהמאה ה-13 ועד המאה ה-19, כולל יצירות של דה וינצ'י, ואן גוך, מונה ועוד.</p>
                <p><strong>מיקום:</strong> Trafalgar Square</p>
                <p><strong>שעות פתיחה:</strong> 10:00-18:00, שישי עד 21:00</p>
              </div>
              
              <div class="info-card">
                <h4>מוזיאון הטבע (Natural History Museum)</h4>
                <p><strong>אוסף:</strong> אוסף עצום של מאובנים, מינרלים, ותצוגות דינוזאורים מרשימות.</p>
                <p><strong>מיקום:</strong> Cromwell Road, South Kensington</p>
                <p><strong>שעות פתיחה:</strong> 10:00-17:50</p>
              </div>
              
              <div class="info-card">
                <h4>מוזיאון ויקטוריה ואלברט (V&A)</h4>
                <p><strong>אוסף:</strong> המוזיאון הגדול בעולם לאמנות ועיצוב, עם למעלה מ-2.3 מיליון פריטים.</p>
                <p><strong>מיקום:</strong> Cromwell Road, South Kensington</p>
                <p><strong>שעות פתיחה:</strong> 10:00-17:45, שישי עד 22:00</p>
              </div>
            </div>
            
            <h3><i class="fas fa-ticket-alt"></i> אתרים היסטוריים בתשלום</h3>
            <div class="info-grid">
              <div class="info-card">
                <h4>מצודת לונדון (Tower of London)</h4>
                <p><strong>אטרקציה:</strong> מצודה היסטורית המאחסנת את תכשיטי הכתר, בעלת היסטוריה מרתקת של למעלה מ-900 שנה.</p>
                <p><strong>מחיר כניסה:</strong> כ-120-150 ש"ח למבוגר</p>
              </div>
              
              <div class="info-card">
                <h4>ארמון וסטמינסטר (Palace of Westminster)</h4>
                <p><strong>אטרקציה:</strong> ביתו של הפרלמנט הבריטי וביג בן, אפשר לסייר בפנים בימים מסוימים.</p>
                <p><strong>מחיר כניסה:</strong> כ-100 ש"ח לסיור מודרך</p>
              </div>
              
              <div class="info-card">
                <h4>ארמון בקינגהאם (Buckingham Palace)</h4>
                <p><strong>אטרקציה:</strong> ביתה הרשמי של המשפחה המלכותית, פתוח לקהל בחודשי הקיץ בלבד.</p>
                <p><strong>מחיר כניסה:</strong> כ-140 ש"ח למבוגר</p>
              </div>
              
              <div class="info-card">
                <h4>אבי רוד סטודיוס (Abbey Road Studios)</h4>
                <p><strong>אטרקציה:</strong> האולפנים המפורסמים של הביטלס. הסטודיו עצמו סגור, אך רבים מבקרים במעבר החצייה האייקוני.</p>
                <p><strong>מחיר כניסה:</strong> חינם לצילום במעבר החצייה</p>
              </div>
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
        const guideSection = document.querySelector('.london-guide-section');
        guideSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
});
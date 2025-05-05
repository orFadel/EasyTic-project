document.addEventListener('DOMContentLoaded', function() {
    // מאזיני אירועים לכרטיסיות
    const guideCards = document.querySelectorAll('.guide-card');
    
    // נתונים מקוריים של כל מודול תוכן
    const contentModules = {
      'general-info': {
        title: 'מידע כללי על דובאי',
        icon: 'fas fa-city',
        content: `
          <div class="general-info-content">
            <p>דובאי היא העיר השנייה בגודלה באיחוד האמירויות הערביות, וידועה כמרכז עסקי ותיירותי מוביל במזרח התיכון. מהכפר דייגים קטן לפני כ-60 שנה, דובאי הפכה למטרופולין בינלאומי עם גורדי שחקים מרהיבים, איים מלאכותיים ומבנים אדריכליים פורצי דרך.</p>
            
            <div class="info-grid">
              <div class="info-card">
                <i class="fas fa-map-marker-alt"></i>
                <h4>מיקום</h4>
                <p>מפרץ הפרסי, איחוד האמירויות הערביות</p>
              </div>
              <div class="info-card">
                <i class="fas fa-language"></i>
                <h4>שפה</h4>
                <p>ערבית (רשמית), אנגלית (נפוצה מאוד)</p>
              </div>
              <div class="info-card">
                <i class="fas fa-pray"></i>
                <h4>דת</h4>
                <p>אסלאם (דת רשמית), אך פתוחה לכל הדתות</p>
              </div>
              <div class="info-card">
                <i class="fas fa-thermometer-half"></i>
                <h4>אקלים</h4>
                <p>חם ויבש, טמפרטורות קיציות יכולות להגיע מעל 40°C</p>
              </div>
            </div>
            
            <h3>עונות מומלצות לביקור</h3>
            <div class="info-grid">
              <div class="info-card">
                <i class="fas fa-sun"></i>
                <h4>נובמבר-מרץ</h4>
                <p><strong>מזג אוויר:</strong> נעים ונוח (20-30°C)</p>
                <p><strong>יתרונות:</strong> מזג אוויר אידיאלי, אפשר ליהנות מפעילויות חוץ</p>
              </div>
              <div class="info-card">
                <i class="fas fa-temperature-high"></i>
                <h4>אפריל-מאי</h4>
                <p><strong>מזג אוויר:</strong> מתחמם (30-38°C)</p>
                <p><strong>יתרונות:</strong> פחות תיירים, מחירי מלונות נוחים יותר</p>
              </div>
              <div class="info-card">
                <i class="fas fa-fire"></i>
                <h4>יוני-אוגוסט</h4>
                <p><strong>מזג אוויר:</strong> חם מאוד (38-48°C)</p>
                <p><strong>יתרונות:</strong> מחירים נמוכים, מתאים לפעילויות פנים</p>
              </div>
              <div class="info-card">
                <i class="fas fa-cloud-sun"></i>
                <h4>ספטמבר-אוקטובר</h4>
                <p><strong>מזג אוויר:</strong> חם, מתקרר בהדרגה (30-40°C)</p>
                <p><strong>יתרונות:</strong> פחות עומס מבקרים, מזג אוויר משתפר</p>
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
                <p>מאז הסכמי אברהם בספטמבר 2020, אזרחי ישראל זכאים לויזת כניסה ללא עלות בהגעה לדובאי. הויזה תקפה ל-90 יום וניתנת בהגעה לשדה התעופה.</p>
                <ul>
                  <li>דרכון בתוקף ל-6 חודשים לפחות מיום היציאה מדובאי</li>
                  <li>כרטיס טיסה הלוך ושוב</li>
                  <li>הוכחת מקום לינה</li>
                </ul>
              </div>
              
              <div class="tip-section">
                <h3><i class="fas fa-coins"></i> כסף ועלויות</h3>
                <p><strong>מטבע:</strong> דירהם (AED). 1 דירהם שווה לערך 1 ש"ח (נכון לאפריל 2025).</p>
                <p><strong>עלויות משוערות:</strong></p>
                <ul>
                  <li><i class="fas fa-hotel"></i> לינה: החל מ-150 ש"ח ללילה (הוסטל) ועד 1,000+ ש"ח (מלון יוקרה)</li>
                  <li><i class="fas fa-utensils"></i> ארוחה: 30-50 ש"ח (מזון מהיר), 100-200 ש"ח (מסעדה בינונית)</li>
                  <li><i class="fas fa-train"></i> נסיעה במטרו: 5-12 ש"ח לכיוון (תלוי במרחק)</li>
                  <li><i class="fas fa-taxi"></i> מונית: פתיחת מונה כ-12 ש"ח + כ-3 ש"ח לק"מ</li>
                </ul>
              </div>
            </div>
            
            <div class="tip-section">
              <h3><i class="fas fa-hands"></i> לבוש והתנהגות</h3>
              <p>למרות שדובאי נחשבת ליברלית יחסית למדינות אחרות במפרץ, יש לכבד את המנהגים המקומיים:</p>
              <ul>
                <li><strong>לבוש:</strong> באזורי תיירות וקניונים אפשר להתלבש בסגנון מערבי, אך מומלץ להתלבש בצניעות. בחופים מותר ללבוש בגדי ים.</li>
                <li><strong>התנהגות ציבורית:</strong> יש להימנע מגילויי חיבה בפומבי, שתיית אלכוהול במקומות ציבוריים (מותר במסעדות מורשות ובמלונות), ומהתנהגות רועשת.</li>
                <li><strong>צילום:</strong> יש להימנע מצילום אנשים מקומיים ללא רשותם, במיוחד נשים לבושות בלבוש מסורתי.</li>
                <li><strong>רמדאן:</strong> בחודש הקדוש יש להימנע מאכילה, שתייה ועישון בפומבי בשעות היום.</li>
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
            <h3>קניונים ושווקים</h3>
            <div class="info-grid">
              <div class="info-card">
                <img src="/dubaiPictures/dubaiGuide/dubaiMall.jpeg" alt="דובאי מול" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>דובאי מול</h4>
                <p>הקניון הגדול בעולם עם למעלה מ-1,200 חנויות, אקווריום, מזרקות, מגרש החלקה על הקרח ועוד אטרקציות.</p>
              </div>
              
              <div class="info-card">
                <img src="/dubaiPictures/dubaiGuide/emiratesMall.jpeg" alt="קניון האמירויות" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>קניון האמירויות</h4>
                <p>קניון יוקרתי המפורסם במיוחד בזכות סקי דובאי - אתר סקי מקורה עם שלג אמיתי.</p>
              </div>
              
              <div class="info-card">
                <img src="/dubaiPictures/dubaiGuide/goldMarket.jpeg" alt="שוק הזהב" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>שוק הזהב</h4>
                <p>שוק מסורתי המציג אלפי פריטי זהב, יהלומים ותכשיטים. מקום מושלם למיקוח.</p>
              </div>
              
              <div class="info-card">
                <img src="/dubaiPictures/dubaiGuide/sMarket.jpeg" alt="שוק התבלינים" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>שוק התבלינים</h4>
                <p>חוויה חושית של צבעים וריחות, עם מגוון רחב של תבלינים, צמחי מרפא ופירות יבשים.</p>
              </div>
            </div>
            
            <h3><i class="fas fa-utensils"></i> קולינריה</h3>
            <div class="two-columns">
              <div>
                <h4>מאכלים מקומיים שחובה לטעום</h4>
                <ul>
                  <li><strong>שווארמה אמירטית</strong> - גרסה מקומית של השווארמה המוכרת</li>
                  <li><strong>מג'בוס</strong> - תבשיל אורז עם בשר ותבלינים</li>
                  <li><strong>אל חבאב</strong> - מעין פנקייק מתוק עם תמרים ומי ורדים</li>
                  <li><strong>קנאפה</strong> - קינוח מזרח תיכוני עם גבינה ובצק דק</li>
                  <li><strong>קהווה</strong> - קפה ערבי מסורתי עם הל</li>
                </ul>
              </div>
              
              <div>
                <h4>מסעדות מומלצות</h4>
                <div class="info-grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));">
                  <div class="info-card" style="text-align: right;">
                    <h5>Al Fanar Restaurant</h5>
                    <p>מסעדה מסורתית אמירטית עם אווירה אותנטית</p>
                    <p><strong>מיקום:</strong> דובאי פסטיבל סיטי</p>
                  </div>
                  <div class="info-card" style="text-align: right;">
                    <h5>Arabian Tea House</h5>
                    <p>בית תה מסורתי עם אוכל אמירטי קל</p>
                    <p><strong>מיקום:</strong> אל פאהידי</p>
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
                <i class="fas fa-shopping-cart"></i>
                <h4>פסטיבל הקניות של דובאי (DSF)</h4>
                <p><strong>מתי:</strong> ינואר-פברואר</p>
                <p>אירוע קניות ענק הנמשך כחודש עם הנחות, מבצעים, מופעים והגרלות יומיות.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-horse"></i>
                <h4>גביע העולם לסוסים - דובאי</h4>
                <p><strong>מתי:</strong> מרץ</p>
                <p>מרוץ הסוסים היוקרתי בעולם עם פרס של 12 מיליון דולר.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-sun"></i>
                <h4>דובאי סאמר סורפרייז</h4>
                <p><strong>מתי:</strong> יוני-אוגוסט</p>
                <p>פסטיבל קיץ עם הנחות במלונות, קניונים ואטרקציות, מיועד להפוך את דובאי ליעד קיץ למרות החום.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-flag"></i>
                <h4>יום הלאום של איחוד האמירויות</h4>
                <p><strong>מתי:</strong> 2 בדצמבר</p>
                <p>חגיגות יום העצמאות עם מצעדים, זיקוקים ואירועים מיוחדים.</p>
              </div>
            </div>
            
            <h3>חגים מוסלמיים (תאריכים משתנים לפי הלוח הירחי)</h3>
            <div class="info-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
              <div class="info-card">
                <i class="fas fa-moon"></i>
                <h4>רמדאן</h4>
                <p>חודש הצום המוסלמי. בשעות היום חלק מהמסעדות סגורות או פתוחות רק לתיירים. בערב יש אווירה חגיגית עם "איפטאר" (ארוחת שבירת צום) וירידים מיוחדים.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-cookie"></i>
                <h4>עיד אל-פיטר</h4>
                <p>חג סיום הרמדאן, נמשך 3 ימים. חנויות רבות ועסקים סגורים ביום הראשון, אך יש חגיגות וזיקוקים.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-mosque"></i>
                <h4>עיד אל-אדחא</h4>
                <p>חג הקורבן, נמשך 4 ימים. מוסדות ציבוריים רבים סגורים, אך מרכזי הקניות ואטרקציות תיירותיות פתוחים.</p>
              </div>
            </div>
          </div>
        `
      },
      'transportation': {
        title: 'תחבורה בדובאי',
        icon: 'fas fa-subway',
        content: `
          <div class="transportation-content">
            <div class="info-grid">
              <div class="info-card">
                <i class="fas fa-train"></i>
                <h4>מטרו דובאי</h4>
                <p>מערכת רכבת תחתית מודרנית עם שני קווים המחברים אזורים מרכזיים בעיר.</p>
                <ul>
                  <li><strong>שעות פעילות:</strong> שבת-רביעי 5:30-24:00, חמישי 5:30-01:00, שישי 10:00-01:00</li>
                  <li><strong>מחיר:</strong> 4-8.5 דירהם לנסיעה (תלוי במרחק)</li>
                  <li><strong>טיפ:</strong> רכשו כרטיס "נול" הניתן לטעינה חוזרת</li>
                </ul>
              </div>
              
              <div class="info-card">
                <i class="fas fa-bus"></i>
                <h4>אוטובוסים</h4>
                <p>רשת אוטובוסים נרחבת המכסה אזורים שהמטרו אינו מגיע אליהם.</p>
                <ul>
                  <li><strong>שעות פעילות:</strong> רוב הקווים פעילים 6:00-24:00</li>
                  <li><strong>מחיר:</strong> 3-10 דירהם (תלוי במרחק)</li>
                </ul>
              </div>
              
              <div class="info-card">
                <i class="fas fa-taxi"></i>
                <h4>מוניות</h4>
                <p>מוניות בדובאי נוחות, נקיות וזמינות מאוד.</p>
                <ul>
                  <li><strong>מחיר:</strong> פתיחת מונה 12 דירהם (בלילה 20 דירהם) + כ-1.96 דירהם לק"מ</li>
                  <li><strong>טיפ:</strong> מוניות עם גג ורוד הן לנשים בלבד עם נהגות נשים</li>
                </ul>
              </div>
              
              <div class="info-card">
                <i class="fas fa-car"></i>
                <h4>השכרת רכב</h4>
                <p>אפשרות נוחה לחקור את דובאי בקצב שלכם.</p>
                <ul>
                  <li>גיל מינימלי: 21 (בחלק מהחברות 25)</li>
                  <li>נדרש רישיון נהיגה בינלאומי בתוקף</li>
                  <li>נוהגים בצד ימין של הכביש</li>
                  <li>חוקי התנועה נאכפים בקפדנות</li>
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
                <h4>דאון טאון (מרכז העיר)</h4>
                <p><strong>מתאים ל:</strong> אוהבי יוקרה, קניות, אטרקציות מרכזיות</p>
                <p><strong>אטרקציות קרובות:</strong> בורג' ח'ליפה, דובאי מול, מזרקות דובאי</p>
                <p><strong>תקציב:</strong> גבוה</p>
              </div>
              
              <div class="info-card">
                <h4>דובאי מרינה</h4>
                <p><strong>מתאים ל:</strong> זוגות, חיי לילה, מסעדות</p>
                <p><strong>אטרקציות קרובות:</strong> חוף מרינה, The Walk, יאכטות</p>
                <p><strong>תקציב:</strong> בינוני-גבוה</p>
              </div>
              
              <div class="info-card">
                <h4>ג'ומיירה</h4>
                <p><strong>מתאים ל:</strong> משפחות, חופשות חוף</p>
                <p><strong>אטרקציות קרובות:</strong> חוף ג'ומיירה, אקווהוונצ'ר, ווילד וואדי</p>
                <p><strong>תקציב:</strong> בינוני-גבוה</p>
              </div>
              
              <div class="info-card">
                <h4>דירה (דובאי הישנה)</h4>
                <p><strong>מתאים ל:</strong> מטיילי תרבות, תקציב מוגבל</p>
                <p><strong>אטרקציות קרובות:</strong> שוק הזהב, שוק התבלינים, מוזיאון דובאי</p>
                <p><strong>תקציב:</strong> נמוך-בינוני</p>
              </div>
            </div>
            
            <h3>טיפים להזמנת מלון בדובאי</h3>
            <ul>
              <li><strong>עונתיות:</strong> מחירי המלונות בדובאי משתנים משמעותית בין עונות השנה. בחודשי הקיץ החמים (יוני-אוגוסט) המחירים נמוכים משמעותית.</li>
              <li><strong>הזמנה מראש:</strong> בעונות שיא (נובמבר-מרץ) מומלץ להזמין לפחות 2-3 חודשים מראש.</li>
              <li><strong>מיסים:</strong> שימו לב שבדובאי יש מס תיירות קבוע (Tourism Dirham Fee) של 10-20 דירהם ללילה למלון בהתאם לדירוג המלון, שלא תמיד כלול במחיר המוצג באתרי ההזמנות.</li>
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
                <img src="/dubaiPictures/dubaiGuide/burj.jpeg" alt="בורג' ח'ליפה" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>בורג' ח'ליפה</h4>
                <p><strong>טיפ:</strong> צלמו מגני דובאי כדי לקבל את המגדל ואת המזרקות יחד, במיוחד בשעות הערב.</p>
              </div>
              
              <div class="info-card">
                <img src="/dubaiPictures/dubaiGuide/dubaiFrame.jpeg" alt="מסגרת דובאי" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>מסגרת דובאי</h4>
                <p><strong>טיפ:</strong> בקרו בשעות הבוקר המוקדמות לתמונות עם פחות אנשים וצלמו מכל הזוויות האפשריות.</p>
              </div>
              
              <div class="info-card">
                <img src="/dubaiPictures/dubaiGuide/dubaiWater.jpeg" alt="אל סיף" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>אל סיף ונחל דובאי</h4>
                <p><strong>טיפ:</strong> חצו את הנחל באברה (סירה מסורתית) וצלמו את הבניינים העתיקים והמודרניים יחד.</p>
              </div>
              
              <div class="info-card">
                <img src="/dubaiPictures/dubaiGuide/miracleGarden.jpeg" alt="פארק המירקל גארדן" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>פארק המירקל גארדן</h4>
                <p><strong>טיפ:</strong> בקרו בחודשים נובמבר-אפריל כשהפארק בשיא פריחתו, וצלמו מעט מהגובה.</p>
              </div>
            </div>
          </div>
        `
      },
      'checklist': {
        title: 'צ\'ק ליסט לטיול בדובאי',
        icon: 'fas fa-check-circle',
        content: `
          <div class="checklist-content">
            <p>רשימת הכנות חשובות לפני היציאה לטיול בדובאי:</p>
            
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
                <label for="check5">מתאם חשמל (בדובאי משתמשים בשקעים בריטיים Type G)</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check6">
                <label for="check6">כסף מקומי או כרטיס אשראי בינלאומי</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check7">
                <label for="check7">כרטיסים לאטרקציות מרכזיות (מומלץ להזמין מראש)</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check8">
                <label for="check8">הורדת אפליקציות מקומיות (RTA Dubai לתחבורה, Careem/Uber להסעות)</label>
              </div>
            </div>
            
            <div class="final-tips">
              <h3><i class="fas fa-star"></i> טיפים אחרונים לפני היציאה</h3>
              <ul>
                <li>הצטיידו בבגדים קלים לחום, אך גם בבגד חם לאזורים ממוזגים מאוד כמו קניונים.</li>
                <li>קרם הגנה וכובע הם חובה, במיוחד בחודשים החמים.</li>
                <li>מים - שתו הרבה מים מבקבוקים, במיוחד בחודשי הקיץ.</li>
                <li>אל תהססו לפנות לעזרה מהמקומיים - תושבי דובאי ידידותיים מאוד לתיירים.</li>
              </ul>
            </div>
          </div>
        `
      },
      'kosher': {
        title: 'אוכל כשר בדובאי',
        icon: 'fas fa-utensils',
        content: `
          <div class="kosher-content">
            <h3><i class="fas fa-star-of-david"></i> מסעדות כשרות בדובאי</h3>
            <p>מאז הסכמי אברהם ב-2020, דובאי הפכה ליעד אטרקטיבי למטיילים ישראלים, ובעקבות זאת נפתחו מספר מסעדות כשרות באמירויות. הנה רשימה של מסעדות כשרות מומלצות בדובאי:</p>
            
            <div class="info-grid">
              <div class="info-card">
                <h4>Armani/Kaf במלון ארמני</h4>
                <p><strong>סגנון:</strong> חלבי בשרי מדי יום לסירוגין</p>
                <p><strong>כשרות:</strong> בהשגחת רב מקומי</p>
                <p><strong>מיקום:</strong> בורג' חליפה, הבניין הגבוה בעולם</p>
                <p><strong>מחיר:</strong> ₪₪₪₪ (יקר)</p>
                <p><strong>טיפ:</strong> יש לבדוק מראש האם המסעדה חלבית או בשרית ביום הביקור</p>
              </div>
              
              <div class="info-card">
                <h4>Elli's Kosher Kitchen</h4>
                <p><strong>סגנון:</strong> בשרי, מטבח ביתי</p>
                <p><strong>כשרות:</strong> בהשגחת OU</p>
                <p><strong>מיקום:</strong> למידע מדויק יש לפנות ישירות למסעדה</p>
                <p><strong>מחיר:</strong> ₪₪₪ (בינוני-גבוה)</p>
                <p><strong>טיפ:</strong> מומלץ להזמין מקום מראש</p>
              </div>
              
              <div class="info-card">
                <h4>בית חב"ד דובאי</h4>
                <p><strong>סגנון:</strong> ארוחות שבת ומועדים</p>
                <p><strong>כשרות:</strong> חב"ד</p>
                <p><strong>מיקום:</strong> יש לברר מול בית חב"ד המקומי</p>
                <p><strong>מחיר:</strong> ₪₪ (בינוני)</p>
                <p><strong>טיפ:</strong> מומלץ להירשם מבעוד מועד לארוחות שבת</p>
              </div>
              
              <div class="info-card">
                <h4>Kosher Place</h4>
                <p><strong>סגנון:</strong> בשרי, מזרחי</p>
                <p><strong>כשרות:</strong> בהשגחה מקומית</p>
                <p><strong>מיקום:</strong> בקרבת מרכז העיר</p>
                <p><strong>מחיר:</strong> ₪₪ (בינוני)</p>
                <p><strong>טיפ:</strong> שירות משלוחים זמין</p>
              </div>
            </div>
            
            <h3><i class="fas fa-shopping-basket"></i> מוצרים כשרים בדובאי</h3>
            <p>ניתן למצוא מוצרים כשרים במקומות הבאים:</p>
            <ul>
              <li><strong>Park n Shop</strong> - רשת סופרמרקטים עם מחלקה של מוצרים כשרים</li>
              <li><strong>Spinneys</strong> - רשת סופרמרקטים עם מוצרים מיובאים רבים כולל כשרים</li>
              <li><strong>Waitrose</strong> - מגוון מוצרים כשרים מיובאים</li>
              <li><strong>קהילת חב"ד</strong> - אפשרות לרכישת מוצרים כשרים בסיסיים</li>
            </ul>
            
            <h3><i class="fas fa-info-circle"></i> טיפים נוספים</h3>
            <ul>
              <li>מומלץ להזמין מקומות מראש במסעדות הכשרות, במיוחד בעונות התיירות הגבוהות</li>
              <li>ניתן להזמין אוכל כשר למלון במסגרת שירות משלוחים</li>
              <li>אם שוהים לתקופה ארוכה, כדאי לשקול דירה עם מטבח ולבשל באופן עצמאי</li>
              <li>רכשו נתיך (טיימר שבת) אם נשארים בשבתות</li>
              <li>בבתי מלון רבים ניתן לבקש מיחם מים לשבת (לעיתים בתשלום)</li>
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
        const guideSection = document.querySelector('.dubai-guide-section');
        guideSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
});
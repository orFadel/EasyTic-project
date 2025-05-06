document.addEventListener('DOMContentLoaded', function() {
    // מאזיני אירועים לכרטיסיות
    const guideCards = document.querySelectorAll('.guide-card');
    
    // נתונים מקוריים של כל מודול תוכן
    const contentModules = {
      'general-info': {
        title: 'מידע כללי על רומא',
        icon: 'fas fa-city',
        content: `
          <div class="general-info-content">
            <p>רומא, בירתה של איטליה, היא אחת הערים העתיקות והמרתקות בעולם. העיר הנצחית, כפי שהיא מכונה, משלבת היסטוריה עשירה של למעלה מ-2,700 שנה, אמנות, אדריכלות, תרבות וקולינריה באופן שאין שני לו.</p>
            
            <div class="info-grid">
              <div class="info-card">
                <i class="fas fa-map-marker-alt"></i>
                <h4>מיקום</h4>
                <p>מרכז איטליה, בירת איטליה ומחוז לאציו</p>
              </div>
              <div class="info-card">
                <i class="fas fa-language"></i>
                <h4>שפה</h4>
                <p>איטלקית (רשמית), אנגלית מדוברת בעיקר באזורי תיירות</p>
              </div>
              <div class="info-card">
                <i class="fas fa-church"></i>
                <h4>דת</h4>
                <p>נצרות קתולית (מרכז העולם הקתולי בוותיקן)</p>
              </div>
              <div class="info-card">
                <i class="fas fa-thermometer-half"></i>
                <h4>אקלים</h4>
                <p>ים תיכוני, קיץ חם ויבש, חורף מתון וגשום</p>
              </div>
            </div>
            
            <h3>עונות מומלצות לביקור</h3>
            <div class="info-grid">
              <div class="info-card">
                <i class="fas fa-leaf"></i>
                <h4>אביב (אפריל-יוני)</h4>
                <p><strong>מזג אוויר:</strong> נעים (15-25°C)</p>
                <p><strong>יתרונות:</strong> טמפרטורות נוחות, פריחה ברחבי העיר, התחלת עונת התיירות</p>
              </div>
              <div class="info-card">
                <i class="fas fa-sun"></i>
                <h4>קיץ (יולי-אוגוסט)</h4>
                <p><strong>מזג אוויר:</strong> חם (25-35°C)</p>
                <p><strong>יתרונות:</strong> שעות אור ארוכות, אירועי קיץ ופסטיבלים, דוכני גלידה בכל פינה</p>
                <p><strong>חסרונות:</strong> חם מאוד, הומה תיירים, חלק מהעסקים סגורים באוגוסט</p>
              </div>
              <div class="info-card">
                <i class="fas fa-tree"></i>
                <h4>סתיו (ספטמבר-אוקטובר)</h4>
                <p><strong>מזג אוויר:</strong> נעים (15-25°C)</p>
                <p><strong>יתרונות:</strong> פחות צפוף, מזג אוויר נוח, פסטיבלי אוכל ויין</p>
              </div>
              <div class="info-card">
                <i class="fas fa-snowflake"></i>
                <h4>חורף (נובמבר-מרץ)</h4>
                <p><strong>מזג אוויר:</strong> קריר וגשום (5-15°C)</p>
                <p><strong>יתרונות:</strong> מעט תיירים, מחירים נמוכים, חגיגות חורף מיוחדות</p>
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
                <p>אזרחי ישראל אינם צריכים ויזה לביקור באיטליה (חלק מהסכם שנגן) לשהייה של עד 90 יום. נדרש:</p>
                <ul>
                  <li>דרכון בתוקף ל-3 חודשים לפחות מתאריך היציאה המתוכנן מאיטליה</li>
                  <li>כרטיס טיסה חזרה או המשך נסיעה</li>
                  <li>הוכחת לינה ואמצעים כספיים מספקים לתקופת השהייה</li>
                </ul>
              </div>
              
              <div class="tip-section">
                <h3><i class="fas fa-coins"></i> כסף ועלויות</h3>
                <p><strong>מטבע:</strong> אירו (€). 1 אירו שווה לערך 4 ש"ח (נכון לאפריל 2025).</p>
                <p><strong>עלויות משוערות:</strong></p>
                <ul>
                  <li><i class="fas fa-hotel"></i> לינה: החל מ-200 ש"ח ללילה (הוסטל) ועד 1,500+ ש"ח (מלון יוקרה)</li>
                  <li><i class="fas fa-utensils"></i> ארוחה: 60-100 ש"ח (מסעדה פשוטה), 150-300 ש"ח (מסעדה טובה)</li>
                  <li><i class="fas fa-train"></i> כרטיס תחבורה ציבורית: כ-6 ש"ח לנסיעה, 25 ש"ח לכרטיס יומי</li>
                  <li><i class="fas fa-taxi"></i> מונית: פתיחת מונה כ-15 ש"ח + כ-5 ש"ח לק"מ</li>
                </ul>
              </div>
            </div>
            
            <div class="tip-section">
              <h3><i class="fas fa-hands"></i> התנהגות והתנהלות</h3>
              <p>טיפים להתנהלות מוצלחת ברומא:</p>
              <ul>
                <li><strong>לבוש:</strong> בביקור באתרים דתיים (כמו הוותיקן), יש להקפיד על לבוש צנוע המכסה כתפיים וברכיים.</li>
                <li><strong>שעות פעילות:</strong> רבים מהעסקים סגורים לכמה שעות בצהריים (Riposo, בין 13:00-16:00).</li>
                <li><strong>טיפים:</strong> מקובל להשאיר טיפ של 5-10% במסעדות, אך לא חובה אם כבר נכלל "דמי שירות" בחשבון.</li>
                <li><strong>מים:</strong> ברחבי רומא יש ברזיות מים ציבוריות הנקראות "Nasoni" - המים שלהן באיכות מעולה וחינמיים.</li>
                <li><strong>תיירים:</strong> היזהרו מכייסים באזורים הומי תיירים ובתחבורה ציבורית.</li>
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
            <h3>אזורי קניות ושווקים</h3>
            <div class="info-grid">
              <div class="info-card">
                <img src="romePictures/romeGuide/saintPetrus.jpeg" alt="כיכר פטרוס הקדוש" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>כיכר פטרוס הקדוש</h4>
                <p><strong>טיפ:</strong> עלו לכיפת הבזיליקה לתצפית פנורמית, או צלמו מהכיכר בשעות הבוקר המוקדמות.</p>
              </div>
              
              <div class="info-card">
                <img src="romePictures/romeGuide/terrazzaPincio.jpeg" alt="מרפסת פינצ׳ו" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>מרפסת פינצ׳ו (Terrazza del Pincio)</h4>
                <p><strong>טיפ:</strong> מקום מושלם לצילום שקיעה מעל כיכר פופולו והנוף של רומא.</p>
              </div>
            </div>
          </div>
        `
      },
      'checklist': {
        title: 'צ\'ק ליסט לטיול ברומא',
        icon: 'fas fa-check-circle',
        content: `
          <div class="checklist-content">
            <p>רשימת הכנות חשובות לפני היציאה לטיול ברומא:</p>
            
            <div class="checklist-container">
              <div class="checklist-item">
                <input type="checkbox" id="check1">
                <label for="check1">דרכון בתוקף (לפחות 3 חודשים מתאריך היציאה)</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check2">
                <label for="check2">כרטיסי טיסה</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check3">
                <label for="check3">הזמנת מלון/דירה</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check4">
                <label for="check4">ביטוח נסיעות מקיף (כולל כיסוי רפואי והטסה)</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check5">
                <label for="check5">כרטיסים מוזמנים מראש לאטרקציות פופולריות (וותיקן, קולוסיאום)</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check6">
                <label for="check6">מטבע מקומי (אירו) או כרטיס אשראי בינלאומי ללא עמלות</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check7">
                <label for="check7">מתאם חשמל אירופאי (Type C/F - שני פינים עגולים)</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check8">
                <label for="check8">הורדת מפות לשימוש אופליין (Google Maps, Maps.me)</label>
              </div>
              <div class="checklist-item">
                <input type="checkbox" id="check9">
                <label for="check9">אפליקציות: Moovit (תחבורה ציבורית), מילון איטלקי-עברי</label>
              </div>
            </div>
            
            <div class="final-tips">
              <h3><i class="fas fa-star"></i> טיפים אחרונים לפני היציאה</h3>
              <ul>
                <li>הכינו נעליים נוחות להליכה! רומא היא עיר מושלמת לסיורים רגליים.</li>
                <li>הביאו בקבוק מים לשימוש חוזר - ברחבי העיר יש מזרקות מים (Nasoni) עם מים זורמים וטעימים.</li>
                <li>לבוש צנוע לביקור באתרים דתיים - כיסוי כתפיים וברכיים.</li>
                <li>צלמו עותק של הדרכון, כרטיסי אשראי ומסמכים חשובים ושמרו בענן.</li>
                <li>למדו כמה ביטויים בסיסיים באיטלקית - המקומיים מעריכים את המאמץ!</li>
              </ul>
            </div>
          </div>
        `
      },
      'kosher': {
        title: 'אוכל כשר ברומא',
        icon: 'fas fa-utensils',
        content: `
          <div class="kosher-content">
            <h3><i class="fas fa-star-of-david"></i> מסעדות כשרות ברומא</h3>
            <p>רומא היא בית לאחת הקהילות היהודיות העתיקות ביותר באירופה, עם היסטוריה של למעלה מ-2,000 שנה. הגטו היהודי (Jewish Ghetto) הוא האזור המסורתי למציאת אוכל כשר אותנטי, המשלב מטבח יהודי-רומאי מיוחד. הנה רשימה של מסעדות כשרות מומלצות:</p>
            
            <div class="info-grid">
              <div class="info-card">
                <h4>Ba'Ghetto</h4>
                <p><strong>סגנון:</strong> בשרי, מטבח יהודי-רומאי</p>
                <p><strong>כשרות:</strong> בהשגחת הרבנות של רומא</p>
                <p><strong>מיקום:</strong> Via del Portico d'Ottavia 57, באזור הגטו היהודי</p>
                <p><strong>מחיר:</strong> ₪₪₪ (בינוני-גבוה)</p>
                <p><strong>מנות מומלצות:</strong> ארטישוק יהודי (Carciofo alla Giudia), פסטה קאציו א פפה</p>
              </div>
              
              <div class="info-card">
                <h4>Su'Ghetto</h4>
                <p><strong>סגנון:</strong> בשרי, מטבח יהודי-רומאי</p>
                <p><strong>כשרות:</strong> בהשגחת הרבנות של רומא</p>
                <p><strong>מיקום:</strong> Via del Portico d'Ottavia 55, באזור הגטו היהודי</p>
                <p><strong>מחיר:</strong> ₪₪₪ (בינוני)</p>
                <p><strong>מנות מומלצות:</strong> ספגטי עם כדורי בשר, פילה דג</p>
              </div>
              
              <div class="info-card">
                <h4>Bellacarne</h4>
                <p><strong>סגנון:</strong> בשרי, מסעדת בשרים יוקרתית</p>
                <p><strong>כשרות:</strong> בהשגחת הרבנות של רומא</p>
                <p><strong>מיקום:</strong> Via del Portico d'Ottavia 51, באזור הגטו היהודי</p>
                <p><strong>מחיר:</strong> ₪₪₪₪ (גבוה)</p>
                <p><strong>מנות מומלצות:</strong> סטייקים, המבורגרים איכותיים</p>
              </div>
              
              <div class="info-card">
                <h4>C'è Pasta e Pasta</h4>
                <p><strong>סגנון:</strong> חלבי, בית מאפה ופיצרייה</p>
                <p><strong>כשרות:</strong> בהשגחת הרבנות של רומא</p>
                <p><strong>מיקום:</strong> Via del Portico d'Ottavia, באזור הגטו היהודי</p>
                <p><strong>מחיר:</strong> ₪ (נמוך)</p>
                <p><strong>מנות מומלצות:</strong> פוקצ'ה, פיצה, עוגות</p>
              </div>
            </div>
            
            <h3><i class="fas fa-synagogue"></i> אתרים יהודיים ברומא</h3>
            <ul>
              <li><strong>בית הכנסת הגדול של רומא (Tempio Maggiore)</strong> - בית כנסת מפואר שנבנה בתחילת המאה ה-20, כולל מוזיאון יהודי.</li>
              <li><strong>הגטו היהודי</strong> - שכונה היסטורית עם מסעדות, חנויות ואווירה ייחודית.</li>
              <li><strong>קטקומבות יהודיות</strong> - קברים תת-קרקעיים עתיקים של הקהילה היהודית (נדרשת הזמנה מראש).</li>
              <li><strong>הקהילה היהודית של רומא</strong> - מארגנת סיורים, אירועים ושירותי דת.</li>
            </ul>
            
            <h3><i class="fas fa-info-circle"></i> טיפים למטיילים שומרי כשרות</h3>
            <ul>
              <li>מומלץ להזמין מקום מראש, במיוחד בעונת התיירות.</li>
              <li>ניתן למצוא מוצרים כשרים בסופרמרקטים גדולים וחנויות מזון באזור הגטו היהודי.</li>
              <li>למטיילים ארוכי טווח, שקלו דירה עם מטבח.</li>
              <li>צרו קשר עם הקהילה היהודית המקומית לארוחות שבת ואירועים מיוחדים.</li>
            </ul>
            
            <div class="info-note">
              <p><strong>שימו לב:</strong> המידע לגבי כשרות עשוי להשתנות. מומלץ לבדוק את סטטוס הכשרות לפני ההגעה.</p>
            </div>
          </div>
        `
      },
      'must-see': {
        title: 'אתרים חובה ברומא',
        icon: 'fas fa-monument',
        content: `
          <div class="must-see-content">
            <h3>אתרי חובה לביקור ברומא</h3>
            <div class="info-grid">
              <div class="info-card">
                <img src="romePictures/romeGuide/colosseum.jpeg" alt="קולוסיאום" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>קולוסיאום</h4>
                <p>האמפיתיאטרון העתיק והמפורסם ביותר בעולם, שנבנה במאה הראשונה לספירה.</p>
                <p><strong>טיפ:</strong> הזמינו כרטיסים מראש באינטרנט והגיעו מוקדם בבוקר או אחר הצהריים מאוחר להימנע מקהל.</p>
              </div>
              
              <div class="info-card">
                <img src="romePictures/romeGuide/vaticanMue.jpeg" alt="מוזיאוני הוותיקן" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>מוזיאוני הוותיקן וקפלה סיסטינית</h4>
                <p>אוסף האמנות המדהים של הכנסייה הקתולית, כולל הקפלה הסיסטינית עם ציורי התקרה של מיכלאנג'לו.</p>
                <p><strong>טיפ:</strong> הזמינו כרטיס "כניסה מוקדמת" או סיור מודרך כדי להימנע מתורים ארוכים.</p>
              </div>
              
              <div class="info-card">
                <img src="romePictures/romeGuide/forumRomi.jpeg" alt="הפורום הרומי" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>הפורום הרומי ופלטין</h4>
                <p>ליבה העתיק של העיר, עם שרידי מקדשים, בזיליקות ומבני ציבור מתקופת האימפריה הרומית.</p>
                <p><strong>טיפ:</strong> כרטיס משולב עם הקולוסיאום. קחו מדריך או אודיו-גייד להבנה טובה יותר.</p>
              </div>
              
              <div class="info-card">
                <img src="romePictures/romeGuide/pantheon.jpeg" alt="פנתיאון" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>פנתיאון</h4>
                <p>מקדש רומי עתיק מהמאה השנייה עם כיפה מרשימה - אחד המבנים השמורים ביותר מהעת העתיקה.</p>
                <p><strong>טיפ:</strong> הכניסה חופשית, אך יש להירשם מראש באתר האינטרנט.</p>
              </div>
            </div>
            
            <div class="more-sites">
              <h3>אתרים חשובים נוספים</h3>
              <div class="info-grid">
                <div class="info-card">
                  <img src="romePictures/romeGuide/treviFountain.jpeg" alt="מזרקת טרווי" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                  <h4>מזרקת טרווי</h4>
                  <p>המזרקה הבארוקית המפורסמת ביותר בעולם. זרקו מטבע כדי להבטיח שתחזרו לרומא!</p>
                </div>
                
                <div class="info-card">
                  <img src="romePictures/romeGuide/piazzaNavona.jpeg" alt="פיאצה נבונה" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                  <h4>פיאצה נבונה</h4>
                  <p>כיכר בארוקית מרהיבה עם שלוש מזרקות, כולל מזרקת ארבעת הנהרות של ברניני.</p>
                </div>
                
                <div class="info-card">
                  <img src="romePictures/romeGuide/spanishSteps.jpeg" alt="מדרגות ספרדיות" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                  <h4>מדרגות ספרדיות</h4>
                  <p>135 מדרגות המובילות מכיכר ספרדית אל כנסיית טריניטה די מונטי. נקודת מפגש פופולרית.</p>
                </div>
                
                <div class="info-card">
                  <img src="romePictures/romeGuide/castelAngelo.jpeg" alt="קסטל סנט אנג'לו" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                  <h4>קסטל סנט אנג'לו</h4>
                  <p>מבצר עגול שנבנה במקור כמוזוליאום להדריאנוס, שימש לימים כמבצר אפיפיורי ובית סוהר.</p>
                </div>
              </div>
            </div>
            
            <div class="hidden-gems">
              <h3>פנינים חבויות</h3>
              <ul>
                <li><strong>קריפטה של הקפוצ'ינים</strong> - קפלה תת-קרקעית מעוטרת בעצמות של כ-4,000 נזירים.</li>
                <li><strong>מפתח המנעול האבירים של מלטה</strong> - הצצה דרך חור מנעול עם תצפית מושלמת על כיפת פטרוס הקדוש.</li>
                <li><strong>פארק האקוודוקטים</strong> - שרידים מרשימים של אמות מים רומיות בפארק שקט.</li>
                <li><strong>גלריה בורגזה</strong> - אוסף אמנות מדהים בווילה מפוארת, כולל יצירות של קרוואג'ו וברניני.</li>
                <li><strong>קטקומבות</strong> - מערות קבורה תת-קרקעיות עתיקות מחוץ לחומות העיר.</li>
              </ul>
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
                <i class="fas fa-theater-masks"></i>
                <h4>קרנבל רומא</h4>
                <p><strong>מתי:</strong> פברואר (לפני תחילת הצום הקתולי)</p>
                <p>חגיגות עם תהלוכות, תחפושות, ריקודים וקרנבל לילדים בפיאצה דל פופולו.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-cross"></i>
                <h4>שבוע הפסחא</h4>
                <p><strong>מתי:</strong> מרץ/אפריל</p>
                <p>אירועים דתיים רבים, כולל דרך הייסורים ביום שישי הטוב וברכת האפיפיור בכיכר פטרוס הקדוש.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-birthday-cake"></i>
                <h4>נטאלה די רומא (יום הולדת לרומא)</h4>
                <p><strong>מתי:</strong> 21 באפריל</p>
                <p>חגיגות יום הקמת העיר עם מופעים, תהלוכות היסטוריות ומופעי זיקוקים.</p>
              </div>
              
              <div class="info-card">
                <i class="fas fa-music"></i>
                <h4>אסטייט רומנה (קיץ רומאי)</h4>
                <p><strong>מתי:</strong> יוני-ספטמבר</p>
                <p>סדרת אירועי תרבות בקיץ, כולל קונצרטים, תיאטרון, סרטים והופעות לאורך גדות הטיבר.</p>
              </div>
            </div>
            
            <h3>חגים לאומיים (חנויות ואתרים רבים סגורים)</h3>
            <div class="info-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
              <div class="info-card">
                <i class="fas fa-calendar-day"></i>
                <h4>חגים לאומיים</h4>
                <ul>
                  <li><strong>1 בינואר</strong> - ראש השנה האזרחית</li>
                  <li><strong>6 בינואר</strong> - חג ההתגלות (Epiphany)</li>
                  <li><strong>25 באפריל</strong> - יום השחרור</li>
                  <li><strong>1 במאי</strong> - יום העבודה</li>
                  <li><strong>2 ביוני</strong> - יום הרפובליקה</li>
                  <li><strong>15 באוגוסט</strong> - פרוסומציו (Ferragosto)</li>
                  <li><strong>1 בנובמבר</strong> - חג כל הקדושים</li>
                  <li><strong>8 בדצמבר</strong> - חג ההריון הטהור</li>
                  <li><strong>25-26 בדצמבר</strong> - חג המולד וחג הקדוש סטפנוס</li>
                </ul>
              </div>
              
              <div class="info-card">
                <i class="fas fa-info-circle"></i>
                <h4>חשוב לדעת</h4>
                <p>בימי חג לאומיים רבים, אתרים מרכזיים עשויים להיות סגורים או לפעול בשעות מקוצרות. מומלץ לבדוק מראש.</p>
                <p>בחודש אוגוסט, במיוחד סביב ה-15 באוגוסט (Ferragosto), רבים מהרומאים יוצאים לחופשה, ועסקים רבים סגורים.</p>
              </div>
            </div>
          </div>
        `
      },
      'transportation': {
        title: 'תחבורה ברומא',
        icon: 'fas fa-subway',
        content: `
          <div class="transportation-content">
            <div class="info-grid">
              <div class="info-card">
                <i class="fas fa-train"></i>
                <h4>מטרו</h4>
                <p>מערכת המטרו של רומא כוללת שלושה קווים: A (אדום), B (כחול), ו-C (ירוק).</p>
                <ul>
                  <li><strong>שעות פעילות:</strong> 5:30-23:30 (ימים א'-ה'), עד 01:30 (ימי שישי-שבת)</li>
                  <li><strong>מחיר:</strong> כרטיס בודד: 1.5 אירו (תקף ל-100 דקות), כרטיס יומי: 7 אירו</li>
                  <li><strong>טיפ:</strong> הקווים A ו-B עוברים בקרבת רוב האתרים המרכזיים</li>
                </ul>
              </div>
              
              <div class="info-card">
                <i class="fas fa-bus"></i>
                <h4>אוטובוסים</h4>
                <p>רשת אוטובוסים ענפה המכסה אזורים שהמטרו אינו מגיע אליהם.</p>
                <ul>
                  <li><strong>מחיר:</strong> כרטיס בודד זהה למטרו (1.5 אירו)</li>
                  <li><strong>שימושי במיוחד:</strong> קווים 40, 64, 75, 81, 87 עוברים ליד אתרים מרכזיים</li>
                  <li><strong>טיפ:</strong> הורידו אפליקציית Moovit לתכנון מסלולים</li>
                </ul>
              </div>
              
              <div class="info-card">
                <i class="fas fa-taxi"></i>
                <h4>מוניות</h4>
                <p>מוניות רשמיות ברומא הן לבנות עם סמל SPQR.</p>
                <ul>
                  <li><strong>מחיר:</strong> פתיחת מונה 3 אירו (ימי חול), 4.5 אירו (לילות/סופ"ש), 6 אירו (חגים)</li>
                  <li><strong>הזמנה:</strong> דרך אפליקציות כמו MyTaxi או FreeNow</li>
                  <li><strong>טיפ:</strong> היזהרו ממוניות לא רשמיות. קחו מוניות מתחנות מוניות בלבד</li>
                </ul>
              </div>
              
              <div class="info-card">
                <i class="fas fa-walking"></i>
                <h4>הליכה</h4>
                <p>הדרך הטובה ביותר לחוות את רומא היא ברגל.</p>
                <ul>
                  <li>מרבית האתרים המרכזיים נמצאים במרחק הליכה זה מזה</li>
                  <li>המרכז ההיסטורי קומפקטי יחסית</li>
                  <li><strong>טיפ:</strong> נעליים נוחות חובה! המדרכות עשויות להיות לא ישרות</li>
                </ul>
              </div>
            </div>
            
            <h3>כרטיסי תחבורה משתלמים</h3>
            <ul>
              <li><strong>Roma 24h/48h/72h:</strong> כרטיס לתחבורה ציבורית בלתי מוגבלת למשך 24/48/72 שעות (7/12.5/18 אירו)</li>
              <li><strong>Roma Pass:</strong> כרטיס תייר הכולל תחבורה ציבורית וכניסה לאתרים (48 או 72 שעות)</li>
              <li><strong>Omnia Vatican & Rome Card:</strong> כולל כניסה לוותיקן ולאטרקציות עיקריות ברומא</li>
            </ul>
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
                <h4>המרכז ההיסטורי (Centro Storico)</h4>
                <p><strong>מתאים ל:</strong> מטיילים ראשונים ברומא, אוהבי הליכה רגלית</p>
                <p><strong>אטרקציות קרובות:</strong> פנתיאון, פיאצה נבונה, מזרקת טרווי</p>
                <p><strong>תקציב:</strong> גבוה</p>
              </div>
              
              <div class="info-card">
                <h4>מונטי (Monti)</h4>
                <p><strong>מתאים ל:</strong> זוגות, אוהבי אווירה היפסטרית</p>
                <p><strong>אטרקציות קרובות:</strong> קולוסיאום, פורום רומאנו</p>
                <p><strong>תקציב:</strong> בינוני-גבוה</p>
              </div>
              
              <div class="info-card">
                <h4>טרסטוורה (Trastevere)</h4>
                <p><strong>מתאים ל:</strong> אוהבי אוכל, חיי לילה ואווירה אותנטית</p>
                <p><strong>אטרקציות קרובות:</strong> סמטאות ציוריות, מסעדות מקומיות, כנסיית סנטה מריה</p>
                <p><strong>תקציב:</strong> בינוני</p>
              </div>
              
              <div class="info-card">
                <h4>טרמיני / רפובליקה (Termini / Repubblica)</h4>
                <p><strong>מתאים ל:</strong> מטיילים בתקציב, נוחות תחבורתית</p>
                <p><strong>אטרקציות קרובות:</strong> תחנת הרכבת המרכזית, מרחצאות דיוקלטיאנוס</p>
                <p><strong>תקציב:</strong> נמוך-בינוני</p>
              </div>
            </div>
            
            <h3>טיפים להזמנת מלון ברומא</h3>
            <ul>
              <li><strong>עונתיות:</strong> המחירים גבוהים בעונות השיא (אפריל-יוני, ספטמבר-אוקטובר). החודשים הזולים ביותר הם נובמבר-פברואר (למעט תקופת חג המולד).</li>
              <li><strong>מיסים:</strong> קיים מס תיירות בגובה 3-7 אירו לאדם ללילה (תלוי בסוג המלון), שבדרך כלל משולם במקום ולא כלול במחיר ההזמנה.</li>
              <li><strong>גודל חדרים:</strong> חדרי מלון במבנים היסטוריים עשויים להיות קטנים יחסית. אם מקום חשוב לכם, בדקו את גודל החדר בעת ההזמנה.</li>
              <li><strong>מלונות בוטיק:</strong> לחוויה אותנטית יותר, שקלו מלונות בוטיק קטנים או אירוח ביתי (B&B) במקום רשתות בינלאומיות.</li>
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
                <img src="romePictures/romeGuide/orangeGarden.jpeg" alt="גני התפוזים" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>גני התפוזים (Giardino degli Aranci)</h4>
                <p><strong>טיפ:</strong> הגיעו לפני השקיעה לתצפית מדהימה על העיר, עם כיפת ההון ומרחבי רומא.</p>
              </div>
              
              <div class="info-card">
                <img src="romePictures/romeGuide/treviFountain.jpeg" alt="מזרקת טרווי" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>מזרקת טרווי</h4>
                <p><strong>טיפ:</strong> הגיעו מוקדם בבוקר (לפני 8:00) או מאוחר בלילה לתמונות עם פחות אנשים.</p>
              </div>
              
              <div class="info-card">
                <img src="romePictures/romeGuide/viaCondotti.jpeg" alt="ויה קונדוטי" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>ויה קונדוטי ופיאצה די ספניה</h4>
                <p>אזור קניות יוקרתי עם חנויות מעצבים איטלקיים ובינלאומיים. כאן תמצאו את מיטב המותגים היוקרתיים.</p>
              </div>
              
              <div class="info-card">
                <img src="romePictures/romeGuide/campoDeFiorri.jpeg" alt="קמפו דה פיורי" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>שוק קמפו דה פיורי</h4>
                <p>שוק מסורתי שפועל מאז המאה ה-16. בבקרים (עד 14:00) מלא בדוכני ירקות, פירות, פרחים ומזון איטלקי אותנטי.</p>
              </div>
              
              <div class="info-card">
                <img src="romePictures/romeGuide/viaDay.jpeg" alt="ויה דיי קורונרי" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>ויה דיי קורונרי</h4>
                <p>רחוב ציורי ידוע בחנויות עתיקות, גלריות אמנות וחנויות תכשיטים מיוחדות. מקום מצוין למציאת מזכרות איכותיות.</p>
              </div>
              
              <div class="info-card">
                <img src="romePictures/romeGuide/portaPortese.jpeg" alt="פורטה פורטזה" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <h4>שוק פורטה פורטזה</h4>
                <p>שוק הפשפשים הגדול ביותר ברומא, פתוח בימי ראשון בלבד. מציע מגוון רחב של בגדים, אביזרים, עתיקות ומציאות.</p>
              </div>
            </div>
            
            <h3><i class="fas fa-utensils"></i> קולינריה</h3>
            <div class="two-columns">
              <div>
                <h4>מאכלים רומאיים שחובה לטעום</h4>
                <ul>
                  <li><strong>קרבונרה</strong> - פסטה קלאסית עם רוטב ביצים, גבינת פקורינו וגואנצ'יאלה (לחי חזיר)</li>
                  <li><strong>קאצ'יו א פפה</strong> - פסטה פשוטה ומושלמת עם גבינת פקורינו ופלפל שחור</li>
                  <li><strong>סופלי</strong> - כדורי אורז ממולאים בגבינה, מטוגנים</li>
                  <li><strong>קארצ'ופי אלה רומנה</strong> - ארטישוק רומאי מבושל בסגנון מסורתי</li>
                  <li><strong>מריטוצו</strong> - לחמנייה מתוקה ממולאת בקצפת</li>
                </ul>
              </div>
              
              <div>
                <h4>טיפים קולינריים</h4>
                <div class="info-grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));">
                  <div class="info-card" style="text-align: right;">
                    <h5>שעות אוכל</h5>
                    <p>איטלקים אוכלים ארוחת ערב מאוחר. מרבית המסעדות נפתחות לארוחת ערב רק ב-19:30-20:00.</p>
                  </div>
                  <div class="info-card" style="text-align: right;">
                    <h5>אפריטיבו</h5>
                    <p>בין 18:00-20:00 מציעים ברים רבים משקה ובופה קטן במחיר מוזל.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `}
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
        const guideSection = document.querySelector('.rome-guide-section');
        guideSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
});
      
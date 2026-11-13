export type Language="ru"|"uz"|"en";
export function isLanguage(value:unknown):value is Language{return value==="ru"||value==="uz"||value==="en";}
const entries:readonly (readonly [string,string,string])[]=[
  [
    "+998 · Консультация и заявки",
    "+998 · Maslahat va buyurtmalar",
    "+998 · Advice and orders"
  ],
  [
    "/ 01 — КАТАЛОГ ПРОДУКЦИИ",
    "/ 01 — MAHSULOTLAR KATALOGI",
    "/ 01 — PRODUCT CATALOG"
  ],
  [
    "/ 02 — ВАШИ ПАРАМЕТРЫ",
    "/ 02 — SIZNING PARAMETRLARINGIZ",
    "/ 02 — YOUR SPECIFICATIONS"
  ],
  [
    "/ 03 — ВСЁ ПРОСТО",
    "/ 03 — HAMMASI OSON",
    "/ 03 — HOW IT WORKS"
  ],
  [
    "/ EASY PLAST — ВАШ КАБИНЕТ",
    "/ EASY PLAST — SHAXSIY KABINET",
    "/ EASY PLAST — YOUR ACCOUNT"
  ],
  [
    "/ ВАША УПАКОВКА",
    "/ SIZNING QADOQLARINGIZ",
    "/ YOUR PACKAGING"
  ],
  [
    "/ ДАВАЙТЕ НА СВЯЗИ",
    "/ BOGʻLANAMIZ",
    "/ LET'S TALK"
  ],
  [
    "/ ДОСТАВКА И ОФОРМЛЕНИЕ",
    "/ YETKAZIB BERISH VA BUYURTMA",
    "/ DELIVERY AND CHECKOUT"
  ],
  [
    "/ КОНФИГУРАТОР",
    "/ SOZLASH",
    "/ CONFIGURATOR"
  ],
  [
    "/ ПЕЧАТЬ НА ПОЛИЭТИЛЕНЕ",
    "/ POLIETILENGA BOSMA",
    "/ PRINTED POLYETHYLENE"
  ],
  [
    "Easy Plast — главная",
    "Easy Plast — bosh sahifa",
    "Easy Plast — home"
  ],
  [
    "Easy Plast — упаковка под ваш размер",
    "Easy Plast — sizning oʻlchamingizdagi qadoq",
    "Easy Plast — packaging made to fit"
  ],
  [
    "Google не подтвердил вход. Попробуйте ещё раз.",
    "Google kirishni tasdiqlamadi. Qayta urinib koʻring.",
    "Google could not verify your sign-in. Please try again."
  ],
  [
    "Telegram откроет подготовленный текст. Нажмите «Отправить» в чате.",
    "Telegram tayyor matnni ochadi. Chatda «Yuborish» tugmasini bosing.",
    "Telegram opens a prepared message. Press Send in the chat."
  ],
  [
    "Адрес доставки на Google Картах",
    "Google Xaritalarda yetkazib berish manzili",
    "Delivery address on Google Maps"
  ],
  [
    "Адрес согласуем лично",
    "Manzilni alohida kelishamiz",
    "We'll confirm the pickup address"
  ],
  [
    "Белый",
    "Oq",
    "White"
  ],
  [
    "Бытовые и промышленные",
    "Maishiy va sanoat uchun",
    "Household and industrial"
  ],
  [
    "В заявке может быть до 30 позиций.",
    "Bitta buyurtmada 30 tagacha mahsulot boʻlishi mumkin.",
    "An order can contain up to 30 items."
  ],
  [
    "В одной заявке может быть до 30 позиций.",
    "Bitta buyurtmada 30 tagacha mahsulot boʻlishi mumkin.",
    "An order can contain up to 30 items."
  ],
  [
    "ВАШ ПРОДУКТ — ВАШИ ПРАВИЛА",
    "SIZNING MAHSULOTINGIZ — SIZNING QOIDALARINGIZ",
    "YOUR PRODUCT — YOUR RULES"
  ],
  [
    "ВАША ДЛИНА",
    "SIZNING UZUNLIGINGIZ",
    "YOUR LENGTH"
  ],
  [
    "ВАША ЗАЯВКА",
    "SIZNING BUYURTMANGIZ",
    "YOUR ORDER"
  ],
  [
    "ВАША УПАКОВКА",
    "SIZNING QADOQLARINGIZ",
    "YOUR PACKAGING"
  ],
  [
    "ВАША ШИРИНА",
    "SIZNING ENINGIZ",
    "YOUR WIDTH"
  ],
  [
    "Ваш аккаунт.",
    "Sizning hisobingiz.",
    "Your account."
  ],
  [
    "Ваш бренд.",
    "Sizning brendingiz.",
    "Your brand."
  ],
  [
    "Ваш бренд. Ваша упаковка.",
    "Sizning brendingiz. Sizning qadogʻingiz.",
    "Your brand. Your packaging."
  ],
  [
    "Ваш размер",
    "Sizning oʻlchamingiz",
    "Your dimensions"
  ],
  [
    "Ваш точный размер.",
    "Aynan sizning oʻlchamingiz.",
    "Your exact dimensions."
  ],
  [
    "Ваша заявка",
    "Sizning buyurtmangiz",
    "Your order"
  ],
  [
    "Ваша упаковка.",
    "Sizning qadogʻingiz.",
    "Your packaging."
  ],
  [
    "Ваши заявки.",
    "Sizning buyurtmalaringiz.",
    "Your orders."
  ],
  [
    "Ваши контакты",
    "Bogʻlanish maʼlumotlaringiz",
    "Your contact details"
  ],
  [
    "Визуализация помогает выбрать параметры.",
    "Tasvir parametrlarni tanlashga yordam beradi.",
    "The preview helps you choose specifications."
  ],
  [
    "Войдите в аккаунт, чтобы увидеть свои заявки.",
    "Buyurtmalaringizni koʻrish uchun hisobingizga kiring.",
    "Sign in to see your orders."
  ],
  [
    "Войдите через Google",
    "Google orqali kiring",
    "Sign in with Google"
  ],
  [
    "Войдите через Google, чтобы сохранить",
    "Saqlash uchun Google orqali kiring:",
    "Sign in with Google to save"
  ],
  [
    "Войти",
    "Kirish",
    "Sign in"
  ],
  [
    "Войти и сохранить заявку",
    "Kirish va buyurtmani saqlash",
    "Sign in and save order"
  ],
  [
    "Войти через Google",
    "Google orqali kirish",
    "Sign in with Google"
  ],
  [
    "Время приёма, подъезд, особенности упаковки…",
    "Qabul qilish vaqti, kirish joyi, qadoqlash talablari…",
    "Receiving hours, entrance, packaging requirements…"
  ],
  [
    "Все параметры, адреса и история — в одном месте.",
    "Barcha parametrlar, manzillar va tarix bir joyda.",
    "Specifications, addresses and history in one place."
  ],
  [
    "Все решения",
    "Barcha yechimlar",
    "All solutions"
  ],
  [
    "Всё начинается",
    "Hammasi",
    "It all starts"
  ],
  [
    "Всё, что вам нужно.",
    "Sizga kerak boʻlgan hamma narsa.",
    "Everything you need."
  ],
  [
    "Вход Google ещё не подключён. Свяжитесь с Easy Plast по телефону или в Telegram.",
    "Google orqali kirish hali ulanmagan. Easy Plast bilan telefon yoki Telegram orqali bogʻlaning.",
    "Google sign-in is not connected yet. Contact Easy Plast by phone or Telegram."
  ],
  [
    "Вход временно недоступен. Попробуйте ещё раз.",
    "Kirish vaqtincha ishlamayapti. Qayta urinib koʻring.",
    "Sign-in is temporarily unavailable. Please try again."
  ],
  [
    "Вход временно недоступен.",
    "Kirish vaqtincha ishlamayapti.",
    "Sign-in is temporarily unavailable."
  ],
  [
    "Вход через Google скоро будет доступен",
    "Google orqali kirish tez orada ishlaydi",
    "Google sign-in is coming soon"
  ],
  [
    "Вход через Google сохраняет историю заявок. В Telegram можно отправить заявку без входа.",
    "Google orqali kirish buyurtmalar tarixini saqlaydi. Telegram orqali kirmasdan yuborish mumkin.",
    "Google sign-in saves your order history. You can send an order through Telegram without signing in."
  ],
  [
    "Вы вошли через Google",
    "Google orqali kirdingiz",
    "You are signed in with Google"
  ],
  [
    "Вы вышли из аккаунта",
    "Hisobdan chiqdingiz",
    "You have signed out"
  ],
  [
    "Выберите готовое решение или создайте свой вариант.",
    "Tayyor yechimni tanlang yoki oʻz variantingizni yarating.",
    "Choose a ready-made solution or create your own."
  ],
  [
    "Выберите готовое решение или создайте своё —",
    "Tayyor yechimni tanlang yoki oʻzingiz yarating —",
    "Choose a ready-made solution or create your own —"
  ],
  [
    "Выберите отдел и задайте размер, цвет, толщину и объём.",
    "Boʻlimni tanlang, oʻlcham, rang, qalinlik va miqdorni belgilang.",
    "Choose a category, dimensions, color, thickness and quantity."
  ],
  [
    "Выберите решение и настройте его под свой продукт.",
    "Yechimni tanlang va mahsulotingizga moslang.",
    "Choose a solution and tailor it to your product."
  ],
  [
    "Выберите сегодняшнюю или будущую дату",
    "Bugungi yoki kelajakdagi sanani tanlang",
    "Choose today or a future date"
  ],
  [
    "Выберите цвет",
    "Rangni tanlang",
    "Choose a color"
  ],
  [
    "Выберите цвет, толщину и размеры.",
    "Rang, qalinlik va oʻlchamlarni tanlang.",
    "Choose your color, thickness and dimensions."
  ],
  [
    "Выберите ширину рукава, затем укажите нужную длину.",
    "Yeng enini tanlang, soʻng kerakli uzunlikni kiriting.",
    "Choose the sleeve width, then enter the length you need."
  ],
  [
    "Выбрать или задать свой размер",
    "Tanlash yoki oʻz oʻlchamini kiritish",
    "Choose or enter your dimensions"
  ],
  [
    "Выбрать свой цвет",
    "Oʻz rangingizni tanlang",
    "Choose a custom color"
  ],
  [
    "Выбрать упаковку",
    "Qadoqni tanlash",
    "Choose packaging"
  ],
  [
    "Выйти",
    "Chiqish",
    "Sign out"
  ],
  [
    "Главная",
    "Bosh sahifa",
    "Home"
  ],
  [
    "Главное меню",
    "Asosiy menyu",
    "Main menu"
  ],
  [
    "Город / населённый пункт",
    "Shahar / aholi punkti",
    "City / town"
  ],
  [
    "Готовые и индивидуальные решения",
    "Tayyor va individual yechimlar",
    "Ready-made and custom solutions"
  ],
  [
    "Давайте",
    "Keling,",
    "Let's"
  ],
  [
    "Давайте создадим его.",
    "Keling, uni yarataylik.",
    "Let's make it."
  ],
  [
    "Детали производства уточнит менеджер.",
    "Ishlab chiqarish tafsilotlarini menejer aniqlashtiradi.",
    "Our manager will confirm production details."
  ],
  [
    "Длина",
    "Uzunlik",
    "Length"
  ],
  [
    "Для брокколи",
    "Brokkoli uchun",
    "For broccoli"
  ],
  [
    "Для воды",
    "Suv uchun",
    "For water"
  ],
  [
    "Для воды, печенья, овощей и ковров.",
    "Suv, pechenye, sabzavot va gilamlar uchun.",
    "For water, cookies, vegetables and carpets."
  ],
  [
    "Для входа используйте свой аккаунт Google. Мы получим имя и email.",
    "Google hisobingizdan foydalaning. Biz ism va emailingizni olamiz.",
    "Use your Google account. We receive your name and email."
  ],
  [
    "Для каждого продукта —",
    "Har bir mahsulot uchun —",
    "For every product —"
  ],
  [
    "Для какого продукта?",
    "Qaysi mahsulot uchun?",
    "What is it for?"
  ],
  [
    "Для ковров",
    "Gilamlar uchun",
    "For carpets"
  ],
  [
    "Для магазинов и супермаркетов",
    "Doʻkonlar va supermarketlar uchun",
    "For shops and supermarkets"
  ],
  [
    "Для оформления заявки войдите в аккаунт.",
    "Buyurtmani rasmiylashtirish uchun hisobingizga kiring.",
    "Sign in to place an order."
  ],
  [
    "Для печенья",
    "Pechenye uchun",
    "For cookies"
  ],
  [
    "Для чего нужна упаковка?",
    "Qadoq nima uchun kerak?",
    "What will the packaging be used for?"
  ],
  [
    "Добавить в заявку",
    "Buyurtmaga qoʻshish",
    "Add to order"
  ],
  [
    "Добавить ещё упаковку",
    "Yana qadoq qoʻshish",
    "Add more packaging"
  ],
  [
    "Добавьте позиции в заявку, чтобы оформить доставку.",
    "Yetkazib berishni rasmiylashtirish uchun buyurtmaga mahsulot qoʻshing.",
    "Add items to your order to arrange delivery."
  ],
  [
    "Добавьте хотя бы одну позицию.",
    "Kamida bitta mahsulot qoʻshing.",
    "Add at least one item."
  ],
  [
    "Доставим по согласованному адресу или подготовим самовывоз.",
    "Kelishilgan manzilga yetkazamiz yoki olib ketishga tayyorlaymiz.",
    "We deliver to the agreed address or prepare your order for pickup."
  ],
  [
    "Доставим туда, где вы.",
    "Siz turgan joyga yetkazamiz.",
    "Delivered where you need it."
  ],
  [
    "Доставка",
    "Yetkazib berish",
    "Delivery"
  ],
  [
    "Доставка и оформление",
    "Yetkazib berish va rasmiylashtirish",
    "Delivery and checkout"
  ],
  [
    "Доставка по вашему адресу",
    "Manzilingizga yetkazib berish",
    "Delivery to your address"
  ],
  [
    "ЕСТЬ СВОЯ ИДЕЯ?",
    "OʻZ GʻOYANGIZ BORMI?",
    "HAVE AN IDEA?"
  ],
  [
    "Желаемая дата",
    "Istalgan sana",
    "Preferred date"
  ],
  [
    "ЗАЯВКА СОХРАНЕНА",
    "BUYURTMA SAQLANDI",
    "ORDER SAVED"
  ],
  [
    "Загружаем ваши заявки…",
    "Buyurtmalaringiz yuklanmoqda…",
    "Loading your orders…"
  ],
  [
    "Закрыть меню",
    "Menyuni yopish",
    "Close menu"
  ],
  [
    "Закрыть окно входа",
    "Kirish oynasini yopish",
    "Close sign-in window"
  ],
  [
    "Закрыть уведомление",
    "Bildirishnomani yopish",
    "Dismiss notification"
  ],
  [
    "Защитный рукав для хранения и перевозки",
    "Saqlash va tashish uchun himoya yengi",
    "Protective sleeves for storage and transport"
  ],
  [
    "Защитный рукав для ковров",
    "Gilamlar uchun himoya yengi",
    "Protective carpet sleeve"
  ],
  [
    "Заявка не требует предоплаты на сайте.",
    "Saytda oldindan toʻlov talab qilinmaydi.",
    "No advance payment is required on the website."
  ],
  [
    "Заявка сохранена",
    "Buyurtma saqlandi",
    "Order saved"
  ],
  [
    "Здесь будет ваша упаковка",
    "Bu yerda sizning qadoqlaringiz boʻladi",
    "Your packaging will appear here"
  ],
  [
    "ИТОГО В ЗАЯВКЕ",
    "BUYURTMA JAMI",
    "ORDER SUMMARY"
  ],
  [
    "Изменить параметры",
    "Parametrlarni oʻzgartirish",
    "Edit specifications"
  ],
  [
    "Изменить состав",
    "Tarkibni oʻzgartirish",
    "Edit order"
  ],
  [
    "Изменения сохранены",
    "Oʻzgarishlar saqlandi",
    "Changes saved"
  ],
  [
    "Имя получателя",
    "Qabul qiluvchining ismi",
    "Recipient's name"
  ],
  [
    "Индивидуальный заказ",
    "Individual buyurtma",
    "Custom order"
  ],
  [
    "К заявке",
    "Buyurtmaga oʻtish",
    "View order"
  ],
  [
    "Кабинет",
    "Kabinet",
    "Account"
  ],
  [
    "Как вам удобнее?",
    "Qaysi usul sizga qulay?",
    "How would you like to receive it?"
  ],
  [
    "Как к вам обращаться?",
    "Sizga qanday murojaat qilamiz?",
    "What should we call you?"
  ],
  [
    "Каталог",
    "Katalog",
    "Catalog"
  ],
  [
    "Комментарий",
    "Izoh",
    "Comment"
  ],
  [
    "Контакты",
    "Aloqa",
    "Contact"
  ],
  [
    "Координаты сохранены:",
    "Koordinatalar saqlandi:",
    "Coordinates saved:"
  ],
  [
    "Красный",
    "Qizil",
    "Red"
  ],
  [
    "Личный кабинет",
    "Shaxsiy kabinet",
    "Your account"
  ],
  [
    "Любой ваш размер",
    "Istalgan oʻlchamingiz",
    "Any dimensions you need"
  ],
  [
    "Любой параметр можно изменить.",
    "Har qanday parametrni oʻzgartirish mumkin.",
    "Every specification can be changed."
  ],
  [
    "Маршрут, стоимость и дату согласуем с вами.",
    "Yoʻnalish, narx va sanani siz bilan kelishamiz.",
    "We will agree the route, delivery charge and date with you."
  ],
  [
    "Менеджер поможет уточнить детали.",
    "Menejer tafsilotlarni aniqlashtirishga yordam beradi.",
    "Our manager will help confirm the details."
  ],
  [
    "Минимальный заказ — 20 кг",
    "Minimal buyurtma — 20 kg",
    "Minimum order — 20 kg"
  ],
  [
    "Мои заявки",
    "Buyurtmalarim",
    "My orders"
  ],
  [
    "Моё местоположение",
    "Joylashuvim",
    "My location"
  ],
  [
    "Местоположение добавлено к заявке. Укажите также улицу и дом.",
    "Joylashuv buyurtmaga qoʻshildi. Koʻcha va uy raqamini ham kiriting.",
    "Location added to your order. Please also enter the street and building."
  ],
  [
    "НАПИШИТЕ НАМ",
    "BIZGA YOZING",
    "MESSAGE US"
  ],
  [
    "На вашей упаковке.",
    "Sizning qadogʻingizda.",
    "On your packaging."
  ],
  [
    "На согласовании",
    "Kelishilmoqda",
    "Awaiting confirmation"
  ],
  [
    "Название или код цвета",
    "Rang nomi yoki kodi",
    "Color name or code"
  ],
  [
    "Написать в Telegram",
    "Telegram orqali yozish",
    "Message us on Telegram"
  ],
  [
    "Например, тёмно-зелёный / RAL 6005",
    "Masalan, toʻq yashil / RAL 6005",
    "For example, dark green / RAL 6005"
  ],
  [
    "Например: для одежды, хлеба или запчастей",
    "Masalan: kiyim, non yoki ehtiyot qismlar uchun",
    "For example: clothing, bread or spare parts"
  ],
  [
    "Настроить",
    "Sozlash",
    "Configure"
  ],
  [
    "Настройте каждый параметр",
    "Har bir parametrni sozlang",
    "Customize every specification"
  ],
  [
    "Настройте упаковку",
    "Qadoqni sozlang",
    "Configure your packaging"
  ],
  [
    "Начните с выбора подходящей упаковки.",
    "Mos qadoqni tanlashdan boshlang.",
    "Start by choosing your packaging."
  ],
  [
    "Начните с оптимального размера.",
    "Tavsiya etilgan oʻlchamdan boshlang.",
    "Start with a recommended size."
  ],
  [
    "Начнём с упаковки",
    "Qadoqni tanlashdan boshlaymiz",
    "Let's start with packaging"
  ],
  [
    "Не нашли свой размер?",
    "Oʻlchamingizni topmadingizmi?",
    "Can't find your size?"
  ],
  [
    "Не удалось загрузить заявки. Попробуйте ещё раз.",
    "Buyurtmalar yuklanmadi. Qayta urinib koʻring.",
    "Could not load your orders. Please try again."
  ],
  [
    "Не удалось загрузить заявки.",
    "Buyurtmalar yuklanmadi.",
    "Could not load your orders."
  ],
  [
    "Не удалось проверить вход Google.",
    "Google orqali kirishni tekshirib boʻlmadi.",
    "Could not verify Google sign-in."
  ],
  [
    "Не удалось создать сеанс. Попробуйте ещё раз.",
    "Seans yaratilmadi. Qayta urinib koʻring.",
    "Could not create a session. Please try again."
  ],
  [
    "Не удалось сохранить заявку. Параметры сохранены в браузере — попробуйте ещё раз.",
    "Buyurtma saqlanmadi. Parametrlar brauzerda saqlangan — qayta urinib koʻring.",
    "Could not save your order. Your draft is saved in this browser — please try again."
  ],
  [
    "Не удалось сохранить заявку. Попробуйте ещё раз.",
    "Buyurtma saqlanmadi. Qayta urinib koʻring.",
    "Could not save your order. Please try again."
  ],
  [
    "Не удалось сохранить заявку.",
    "Buyurtma saqlanmadi.",
    "Could not save your order."
  ],
  [
    "Не удалось войти.",
    "Hisobga kirib boʻlmadi.",
    "Could not sign in."
  ],
  [
    "Не удалось выйти. Попробуйте ещё раз.",
    "Hisobdan chiqib boʻlmadi. Qayta urinib koʻring.",
    "Could not sign out. Please try again."
  ],
  [
    "Не удалось открыть вход Google.",
    "Google orqali kirishni ochib boʻlmadi.",
    "Could not open Google sign-in."
  ],
  [
    "Google не отвечает. Проверьте соединение и попробуйте ещё раз.",
    "Google javob bermayapti. Internetni tekshirib qayta urinib koʻring.",
    "Google is not responding. Check your connection and try again."
  ],
  [
    "Не удалось загрузить Google. Проверьте соединение.",
    "Google yuklanmadi. Internetni tekshiring.",
    "Could not load Google. Check your connection."
  ],
  [
    "Не удалось определить местоположение. Разрешите доступ в браузере или укажите адрес вручную.",
    "Joylashuv aniqlanmadi. Brauzerda ruxsat bering yoki manzilni qoʻlda kiriting.",
    "Could not find your location. Allow location access or enter the address manually."
  ],
  [
    "Ваш браузер не поддерживает геолокацию. Укажите адрес вручную.",
    "Brauzeringiz geolokatsiyani qoʻllamaydi. Manzilni qoʻlda kiriting.",
    "Your browser does not support geolocation. Enter the address manually."
  ],
  [
    "Неверная дата",
    "Sana notoʻgʻri",
    "Invalid date"
  ],
  [
    "Недопустимый источник запроса.",
    "Soʻrov manbasi ruxsat etilmagan.",
    "Request origin is not allowed."
  ],
  [
    "Нужен особенный размер?",
    "Maxsus oʻlcham kerakmi?",
    "Need a special size?"
  ],
  [
    "Нужна упаковка с логотипом? Позвоните и уточните детали.",
    "Logotipli qadoq kerakmi? Qoʻngʻiroq qilib tafsilotlarni aniqlashtiring.",
    "Need packaging with your logo? Call us to discuss the details."
  ],
  [
    "Обработка данных",
    "Maʼlumotlardan foydalanish",
    "How we use your data"
  ],
  [
    "Обсудим вашу упаковку в Telegram.",
    "Qadoqlaringizni Telegram orqali muhokama qilamiz.",
    "Let's discuss your packaging on Telegram."
  ],
  [
    "Обсудим логотип, размеры, цвет, толщину и объём заказа. Стоимость печати и сроки согласуем индивидуально.",
    "Logotip, oʻlcham, rang, qalinlik va miqdorni muhokama qilamiz. Bosma narxi va muddatini alohida kelishamiz.",
    "We'll discuss your logo, dimensions, color, thickness and quantity. Printing prices and lead times are agreed individually."
  ],
  [
    "Обсудить в Telegram",
    "Telegram orqali muhokama qilish",
    "Discuss on Telegram"
  ],
  [
    "Обсудить доставку с менеджером",
    "Yetkazib berishni menejer bilan muhokama qilish",
    "Discuss delivery with our manager"
  ],
  [
    "Общий объём",
    "Umumiy miqdor",
    "Total weight"
  ],
  [
    "Объём",
    "Miqdor",
    "Quantity"
  ],
  [
    "Объём заказа",
    "Buyurtma miqdori",
    "Order quantity"
  ],
  [
    "Ожидаются данные JSON.",
    "JSON maʼlumotlari kerak.",
    "JSON data is required."
  ],
  [
    "Оптимальный размер",
    "Tavsiya etilgan oʻlcham",
    "Recommended size"
  ],
  [
    "Оставьте заявку",
    "Buyurtma qoldiring",
    "Submit your request"
  ],
  [
    "От размера",
    "Oʻlchamdan",
    "From dimensions"
  ],
  [
    "Открыть Google Карты",
    "Google Xaritalarni ochish",
    "Open Google Maps"
  ],
  [
    "Открыть каталог",
    "Katalogni ochish",
    "Open catalog"
  ],
  [
    "Открыть меню",
    "Menyuni ochish",
    "Open menu"
  ],
  [
    "Отправьте её менеджеру в Telegram, чтобы согласовать цену и доставку.",
    "Narx va yetkazib berishni kelishish uchun buyurtmani Telegram orqali menejerga yuboring.",
    "Send it to our manager on Telegram to confirm pricing and delivery."
  ],
  [
    "Оформить доставку",
    "Yetkazib berishni rasmiylashtirish",
    "Arrange delivery"
  ],
  [
    "ПАКЕТ",
    "PAKET",
    "BAG"
  ],
  [
    "ПЕЧАТЬ НА УПАКОВКЕ",
    "QADOQQA BOSMA",
    "PACKAGING PRINTING"
  ],
  [
    "ПОЗВОНИТЕ НАМ",
    "BIZGA QOʻNGʻIROQ QILING",
    "CALL US"
  ],
  [
    "ПРОДУКЦИЯ",
    "MAHSULOTLAR",
    "PRODUCTS"
  ],
  [
    "ПРОИЗВОДИМ. УПАКОВЫВАЕМ. ДОСТАВЛЯЕМ.",
    "ISHLAB CHIQARAMIZ. QADOQLAYMIZ. YETKAZAMIZ.",
    "WE MAKE. WE PACK. WE DELIVER."
  ],
  [
    "Пакеты «Майка»",
    "«Mayka» paketlar",
    "T-shirt bags"
  ],
  [
    "Пакеты для мусора",
    "Chiqindi paketlari",
    "Trash bags"
  ],
  [
    "Пакеты и полиэтилен с печатью под ваш бизнес.",
    "Biznesingiz uchun bosmali paketlar va polietilen.",
    "Printed bags and polyethylene for your business."
  ],
  [
    "Параметры добавлены в новую заявку",
    "Parametrlar yangi buyurtmaga qoʻshildi",
    "Specifications added to a new order"
  ],
  [
    "Первая заявка уже близко",
    "Birinchi buyurtmangizga bir qadam",
    "Your first order is just a step away"
  ],
  [
    "Передать в Telegram",
    "Telegram orqali yuborish",
    "Send via Telegram"
  ],
  [
    "Передать менеджеру в Telegram",
    "Telegram orqali menejerga yuborish",
    "Send to our manager on Telegram"
  ],
  [
    "Перейти к доставке",
    "Yetkazib berishga oʻtish",
    "Go to delivery"
  ],
  [
    "Перейти к заявке ·",
    "Buyurtmaga oʻtish ·",
    "View order ·"
  ],
  [
    "По вашему адресу",
    "Sizning manzilingizga",
    "To your address"
  ],
  [
    "По вашим параметрам",
    "Sizning parametrlaringiz boʻyicha",
    "Your own specifications"
  ],
  [
    "Повторить загрузку",
    "Qayta yuklash",
    "Try loading again"
  ],
  [
    "Повторить заявку",
    "Qayta buyurtma qilish",
    "Reorder"
  ],
  [
    "Подключаем Google…",
    "Google ulanmoqda…",
    "Connecting to Google…"
  ],
  [
    "Подтверждаем вход…",
    "Kirish tasdiqlanmoqda…",
    "Verifying sign-in…"
  ],
  [
    "Пожелания к заказу",
    "Buyurtma boʻyicha istaklar",
    "Order preferences"
  ],
  [
    "Позвоните нам и уточните детали",
    "Qoʻngʻiroq qiling va tafsilotlarni aniqlashtiring",
    "Call us to discuss the details"
  ],
  [
    "Позиций",
    "Mahsulot turlari",
    "Items"
  ],
  [
    "Пока вы можете собрать заявку и передать её менеджеру в Telegram.",
    "Hozircha buyurtma tuzib, uni Telegram orqali menejerga yuborishingiz mumkin.",
    "You can still build an order and send it to our manager on Telegram."
  ],
  [
    "Показать адрес",
    "Manzilni koʻrsatish",
    "Show address"
  ],
  [
    "Полиэтилен",
    "Polietilen",
    "Polyethylene"
  ],
  [
    "Полиэтиленовая упаковка для вашего бизнеса",
    "Biznesingiz uchun polietilen qadoqlar",
    "Polyethylene packaging for your business"
  ],
  [
    "Получите заказ",
    "Buyurtmangizni oling",
    "Receive your order"
  ],
  [
    "Поможем с размером, подберём параметры",
    "Oʻlcham va parametrlarni tanlashga yordam beramiz",
    "We'll help you choose dimensions and specifications"
  ],
  [
    "Попробовать ещё раз",
    "Qayta urinib koʻrish",
    "Try again"
  ],
  [
    "Применить",
    "Qoʻllash",
    "Apply"
  ],
  [
    "Проверьте данные заявки.",
    "Buyurtma maʼlumotlarini tekshiring.",
    "Check your order details."
  ],
  [
    "Проверьте параметры перед оформлением заявки.",
    "Buyurtma berishdan oldin parametrlarni tekshiring.",
    "Check your specifications before placing an order."
  ],
  [
    "Проверьте размеры, толщину и объём заказа.",
    "Oʻlcham, qalinlik va miqdorni tekshiring.",
    "Check the dimensions, thickness and quantity."
  ],
  [
    "Проверьте параметры заявки.",
    "Buyurtma parametrlarini tekshiring.",
    "Check your order specifications."
  ],
  [
    "Прозрачный",
    "Shaffof",
    "Transparent"
  ],
  [
    "РУКАВ",
    "YENG",
    "SLEEVE"
  ],
  [
    "Разделы каталога",
    "Katalog boʻlimlari",
    "Catalog categories"
  ],
  [
    "Размер и толщина",
    "Oʻlcham va qalinlik",
    "Dimensions and thickness"
  ],
  [
    "Размер под ваш продукт",
    "Mahsulotingizga mos oʻlcham",
    "Sized for your product"
  ],
  [
    "Рекомендуемая ширина",
    "Tavsiya etilgan eni",
    "Recommended width"
  ],
  [
    "С печатью",
    "Bosmali",
    "Printed packaging"
  ],
  [
    "СВЯЗАТЬСЯ С НАМИ",
    "BIZ BILAN BOGʻLANISH",
    "CONTACT US"
  ],
  [
    "СОЗДАНО ПОД ВАШ ПРОДУКТ",
    "MAHSULOTINGIZ UCHUN YARATILGAN",
    "MADE FOR YOUR PRODUCT"
  ],
  [
    "Самовывоз",
    "Olib ketish",
    "Pickup"
  ],
  [
    "Самовывоз — адрес и время согласуем",
    "Olib ketish — manzil va vaqtni kelishamiz",
    "Pickup — address and time to be confirmed"
  ],
  [
    "Самовывоз — по согласованию",
    "Olib ketish — kelishuv asosida",
    "Pickup — by arrangement"
  ],
  [
    "Свой вариант",
    "Oʻz variantim",
    "Custom packaging"
  ],
  [
    "Свой размер",
    "Oʻz oʻlchamingiz",
    "Custom dimensions"
  ],
  [
    "Свой цвет",
    "Oʻz rangingiz",
    "Custom color"
  ],
  [
    "Связаться с нами",
    "Biz bilan bogʻlanish",
    "Contact us"
  ],
  [
    "Сделано под ваш размер.",
    "Sizning oʻlchamingizda yaratilgan.",
    "Made to your dimensions."
  ],
  [
    "Сеанс входа истёк. Откройте окно входа ещё раз.",
    "Kirish seansi tugadi. Kirish oynasini qayta oching.",
    "Your sign-in session expired. Open the sign-in window again."
  ],
  [
    "Синий",
    "Koʻk",
    "Blue"
  ],
  [
    "Слишком большая заявка.",
    "Buyurtma hajmi juda katta.",
    "The order is too large."
  ],
  [
    "Слишком большой запрос.",
    "Soʻrov hajmi juda katta.",
    "The request is too large."
  ],
  [
    "Слишком много заявок за час. Свяжитесь с нами по телефону или в Telegram.",
    "Bir soatda juda koʻp buyurtma yuborildi. Telefon yoki Telegram orqali bogʻlaning.",
    "Too many orders in one hour. Contact us by phone or Telegram."
  ],
  [
    "Согласуем удобные условия",
    "Qulay shartlarni kelishamiz",
    "We'll agree convenient delivery terms"
  ],
  [
    "Создать свой",
    "Oʻzingiz yarating",
    "Create your own"
  ],
  [
    "Создать свою упаковку",
    "Oʻz qadogʻingizni yarating",
    "Create your packaging"
  ],
  [
    "Создать упаковку",
    "Qadoq yaratish",
    "Create packaging"
  ],
  [
    "Сохранить заявку",
    "Buyurtmani saqlash",
    "Save order"
  ],
  [
    "Сохранить изменения",
    "Oʻzgarishlarni saqlash",
    "Save changes"
  ],
  [
    "Сохраняем…",
    "Saqlanmoqda…",
    "Saving…"
  ],
  [
    "Спасибо,",
    "Rahmat,",
    "Thank you,"
  ],
  [
    "Стоимость",
    "Narx",
    "Price"
  ],
  [
    "Стоимость доставки согласуем отдельно.",
    "Yetkazib berish narxini alohida kelishamiz.",
    "Delivery charges are agreed separately."
  ],
  [
    "Стоимость упаковки",
    "Qadoq narxi",
    "Packaging cost"
  ],
  [
    "Ташкент",
    "Toshkent",
    "Tashkent"
  ],
  [
    "Телефон",
    "Telefon",
    "Phone"
  ],
  [
    "Толщина",
    "Qalinlik",
    "Thickness"
  ],
  [
    "Толщина:",
    "Qalinlik:",
    "Thickness:"
  ],
  [
    "Удалить",
    "Oʻchirish",
    "Remove"
  ],
  [
    "Укажите адрес при оформлении заявки.",
    "Buyurtma berishda manzilingizni kiriting.",
    "Enter your address during checkout."
  ],
  [
    "Укажите имя получателя",
    "Qabul qiluvchining ismini kiriting",
    "Enter the recipient's name"
  ],
  [
    "Укажите контакты и адрес. Менеджер подтвердит стоимость и сроки.",
    "Kontakt va manzilni kiriting. Menejer narx va muddatlarni tasdiqlaydi.",
    "Enter your contact details and address. Our manager will confirm pricing and timing."
  ],
  [
    "Укажите контакты и адрес. Стоимость и сроки согласуем лично.",
    "Kontakt va manzilni kiriting. Narx va muddatlarni alohida kelishamiz.",
    "Enter your contact details and address. We'll confirm delivery charges and timing with you."
  ],
  [
    "Укажите номер Узбекистана: +998 и 9 цифр",
    "Oʻzbekiston raqamini kiriting: +998 va 9 ta raqam",
    "Enter an Uzbekistan number: +998 and 9 digits"
  ],
  [
    "Укажите обе координаты",
    "Ikkala koordinatani kiriting",
    "Enter both coordinates"
  ],
  [
    "Укажите полный адрес или добавьте геолокацию. Адрес сохранится вместе с заявкой.",
    "Toʻliq manzilni kiriting yoki geolokatsiya qoʻshing. Manzil buyurtma bilan saqlanadi.",
    "Enter the full address or add your location. The address will be saved with your order."
  ],
  [
    "Укажите свой размер или оставьте оптимальные параметры.",
    "Oʻz oʻlchamingizni kiriting yoki tavsiya etilganini qoldiring.",
    "Enter your dimensions or keep the recommended size."
  ],
  [
    "Укажите улицу, дом и ориентир для доставки",
    "Yetkazib berish uchun koʻcha, uy va moʻljalni kiriting",
    "Enter the street, building and delivery landmark"
  ],
  [
    "Укажите, для чего нужна упаковка",
    "Qadoq nima uchun kerakligini yozing",
    "Describe what the packaging is for"
  ],
  [
    "Улица, дом и ориентир",
    "Koʻcha, uy va moʻljal",
    "Street, building and landmark"
  ],
  [
    "Улица, номер дома, ориентир",
    "Koʻcha, uy raqami, moʻljal",
    "Street, building number, landmark"
  ],
  [
    "Упаковка для 19-литровой бутыли",
    "19 litrli idish uchun qadoq",
    "Packaging for 19-liter water bottles"
  ],
  [
    "Упаковка для кондитерской продукции",
    "Qandolat mahsulotlari uchun qadoq",
    "Packaging for confectionery"
  ],
  [
    "Упаковка для овощей и свежей продукции",
    "Sabzavot va yangi mahsulotlar uchun qadoq",
    "Packaging for vegetables and fresh produce"
  ],
  [
    "Упаковка для печенья",
    "Pechenye uchun qadoq",
    "Cookie packaging"
  ],
  [
    "Упаковка для брокколи",
    "Brokkoli uchun qadoq",
    "Broccoli packaging"
  ],
  [
    "Упаковка по вашим параметрам",
    "Sizning parametrlaringiz boʻyicha qadoq",
    "Packaging to your specifications"
  ],
  [
    "Упаковка по вашим правилам.",
    "Sizning qoidalaringizdagi qadoq.",
    "Packaging by your rules."
  ],
  [
    "Упаковка с печатью",
    "Bosmali qadoq",
    "Printed packaging"
  ],
  [
    "Упаковка, которая подходит.",
    "Aynan mos keladigan qadoq.",
    "Packaging that fits."
  ],
  [
    "Упаковка добавлена в вашу заявку",
    "Qadoq buyurtmangizga qoʻshildi",
    "Packaging added to your order"
  ],
  [
    "Хорошая упаковка.",
    "Sifatli qadoq.",
    "Great packaging."
  ],
  [
    "Цвет и толщина на выбор",
    "Rang va qalinlikni tanlash",
    "Your choice of color and thickness"
  ],
  [
    "Чтобы сохранять заявки и возвращаться к ним с любого устройства.",
    "Buyurtmalarni saqlab, ularga istalgan qurilmadan qaytish uchun.",
    "Save your orders and access them from any device."
  ],
  [
    "Чёрный",
    "Qora",
    "Black"
  ],
  [
    "Ширина",
    "Eni",
    "Width"
  ],
  [
    "Ширина × длина × толщина",
    "Eni × uzunlik × qalinlik",
    "Width × length × thickness"
  ],
  [
    "Ширина, длина, цвет и толщина — всё под ваш продукт.",
    "Eni, uzunlik, rang va qalinlik — hammasi mahsulotingizga mos.",
    "Width, length, color and thickness — all tailored to your product."
  ],
  [
    "до вашей двери.",
    "eshigingizgacha.",
    "to your doorstep."
  ],
  [
    "заявки и историю заказов.",
    "buyurtmalaringiz va ularning tarixini.",
    "your orders and order history."
  ],
  [
    "и обсудим доставку вашего заказа.",
    "va yetkazib berishni kelishamiz.",
    "and arrange your delivery."
  ],
  [
    "кг",
    "kg",
    "kg"
  ],
  [
    "мкм",
    "mkm",
    "μm"
  ],
  [
    "необязательно",
    "ixtiyoriy",
    "optional"
  ],
  [
    "поз.",
    "tur",
    "items"
  ],
  [
    "позиций",
    "tur",
    "items"
  ],
  [
    "появилась в личном кабинете.",
    "shaxsiy kabinetingizga saqlandi.",
    "is now in your account."
  ],
  [
    "с нужным цветом, размером и толщиной.",
    "kerakli rang, oʻlcham va qalinlikda.",
    "with your chosen color, dimensions and thickness."
  ],
  [
    "с разговора.",
    "suhbatdan boshlanadi.",
    "with a conversation."
  ],
  [
    "своя упаковка.",
    "oʻz qadogʻi.",
    "its own packaging."
  ],
  [
    "см",
    "cm",
    "cm"
  ],
  [
    "сум",
    "soʻm",
    "UZS"
  ],
  [
    "упакуем её.",
    "uni qadoqlaymiz.",
    "package it."
  ],
  [
    "Язык сайта",
    "Sayt tili",
    "Website language"
  ],
  [
    "Назначение",
    "Qoʻllanishi",
    "Intended use"
  ],
  [
    "Цена за кг",
    "Bir kg narxi",
    "Price per kg"
  ],
  [
    "Доставка:",
    "Yetkazib berish:",
    "Delivery:"
  ],
  [
    "Желаемая дата:",
    "Istalgan sana:",
    "Preferred date:"
  ],
  [
    "Комментарий:",
    "Izoh:",
    "Comment:"
  ],
  [
    "Итого:",
    "Jami:",
    "Total:"
  ],
  [
    "Здравствуйте! Заявка",
    "Salom! Buyurtma",
    "Hello! Order"
  ],
  [
    "в Easy Plast.",
    "Easy Plast uchun.",
    "at Easy Plast."
  ],
  [
    "Прошу подтвердить стоимость и сроки.",
    "Narx va muddatlarni tasdiqlashingizni soʻrayman.",
    "Please confirm the price and lead time."
  ],
  [
    "без номера — расчёт стоимости",
    "raqamsiz — narxni hisoblash",
    "unnumbered — price inquiry"
  ],
  [
    "Упаковка для воды",
    "Suv uchun qadoq",
    "Water packaging"
  ],
  [
    "Пакет «Майка»",
    "«Mayka» paketi",
    "T-shirt carrier bag"
  ],
  [
    "Пакет для мусора",
    "Chiqindi paketi",
    "Trash bag"
  ],
  [
    "Как мы используем ваши данные",
    "Maʼlumotlaringizdan qanday foydalanamiz",
    "How we use your data"
  ],
  [
    "Вернуться в Easy Plast",
    "Easy Plast saytiga qaytish",
    "Back to Easy Plast"
  ],
  [
    "Пароль Google сайту не передаётся.",
    "Google parolingiz saytga uzatilmaydi.",
    "Your Google password is never sent to this website."
  ],
  [
    "При входе через Google мы получаем имя и email для вашего аккаунта.",
    "Google orqali kirishda hisobingiz uchun ism va emailni olamiz.",
    "When you sign in with Google, we receive your name and email for your account."
  ],
  [
    "Мы сохраняем параметры упаковки, назначение, телефон, адрес и комментарий к заявке, чтобы согласовать производство и доставку.",
    "Ishlab chiqarish va yetkazib berishni kelishish uchun qadoq parametrlari, qoʻllanishi, telefon, manzil va izohni saqlaymiz.",
    "We save packaging specifications, intended use, phone number, address and order comments to arrange production and delivery."
  ],
  [
    "Координаты добавляются только при использовании кнопки геолокации.",
    "Koordinatalar faqat geolokatsiya tugmasidan foydalanganda qoʻshiladi.",
    "Coordinates are added only when you use the location button."
  ],
  [
    "Корзина, незавершённая форма и выбранный язык хранятся в вашем браузере. Защищённый cookie используется для входа.",
    "Savat, tugallanmagan shakl va tanlangan til brauzeringizda saqlanadi. Kirish uchun himoyalangan cookie ishlatiladi.",
    "Your basket, draft form and language preference are stored in your browser. A secure cookie is used for sign-in."
  ],
  [
    "Google Карты загружаются с серверов Google. Кнопка Telegram открывает подготовленный текст: отправку подтверждаете вы в чате.",
    "Google Xaritalar Google serverlaridan yuklanadi. Telegram tugmasi tayyor matnni ochadi: uni yuborishni chatda oʻzingiz tasdiqlaysiz.",
    "Google Maps loads from Google's servers. The Telegram button opens a prepared message: you choose whether to send it in the chat."
  ],
  [
    "По вопросам данных и удаления сохранённых заявок свяжитесь с нами:",
    "Maʼlumotlar yoki saqlangan buyurtmalarni oʻchirish boʻyicha biz bilan bogʻlaning:",
    "For questions about your data or deleting saved orders, contact us:"
  ]
];
const extra:readonly (readonly [string,string,string])[]=[
 ["Оптимальные размеры","Tavsiya etilgan oʻlchamlar","Recommended sizes"],
 ["Войдите через Google, чтобы сохранить заявку.","Buyurtmani saqlash uchun Google orqali kiring.","Sign in with Google to save your order."],
 ["Сначала добавьте упаковку в заявку.","Avval buyurtmaga qadoq qoʻshing.","Add packaging to your order first."]
];
import {detailMessages} from "./detail-messages";
const dictionary=new Map([...entries,...extra,...detailMessages].map(([ru,uz,en])=>[ru,{ru,uz,en}]));
export function translate(text:string,lang:Language):string {
  const key=text.trim();const entry=dictionary.get(key);
  if(entry)return text.replace(key,entry[lang]);
  if(lang!=="ru")return text.replace(/(^|[\s/])(мкм|см|кг|сум)(?=$|[\s·,:])/g,(_,before,unit)=>before+({мкм:lang==="uz"?"mkm":"μm",см:"cm",кг:"kg",сум:lang==="uz"?"soʻm":"UZS"}[unit as "см"]));
  return text;
}

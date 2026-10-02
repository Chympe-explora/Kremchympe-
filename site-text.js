/* =====================================================================
   SITE-TEXT.JS  —  EVERY WORD YOU SEE ON THE WEBSITE LIVES IN THIS FILE
   =====================================================================

   HOW TO EDIT (very easy):
   1. Find the words you want to change. Each line looks like this:
          heroHeading: "EXPLORE KREM CHYMPE AT YOUR OWN PACE",
   2. Change ONLY the words between the quote marks " ".
   3. Do NOT delete the quote marks, the comma at the end, or the name before the colon.
   4. Want a new line inside a sentence?  Type \n   (backslash + n).
   5. Need a quote mark inside your words?  Type \"  or use ‘ ’ instead.
   6. Words in curly brackets, like {name} or {price}, are filled in
      automatically. Keep them exactly as they are (you can move them).
   7. Save the file and refresh the website. Done!

   If you see something like [[home.xyz]] on the website, a line was
   deleted by mistake. Put it back (copy it from the zip) and refresh.

   PRICES are NOT here. Prices live in  pricing.json.
   Words like {minAdvance}, {child}, {days}, {expedition.days} are filled in from pricing.json automatically, so change a price there and every sentence follows.
   ===================================================================== */

window.TEXT = {

/* ---------- Used everywhere ---------- */
common: {
  currency: "₹",
  loaderText: "Krem Chympe"              /* word shown on the blue curtain between pages */
},

/* ---------- Phone, email, Instagram (used on several pages) ---------- */
/* WEBSITE A (the backend that receives bookings). Paste YOUR backend address here (no slash at the end).
   The admin switches Group / WhatsApp and sets the WhatsApp number inside the Telegram admin bot -> "Website B Submit". */
backend: {
  url: "https://teamexploera-backend.book-and-explore.workers.dev"
},

contact: {
  phoneShow: "91 76279 42622",            /* how the number looks on screen */
  phoneForLink: "+9176279 42622",         /* same number, no spaces, with country code (used when someone taps it) */
  email: "teamexploera@gmail.com",
  instagramUrl: "https://www.instagram.com/team_explo_era?stkn=ZHZpODB3aXl0bXBu",
  instagramHandle: "@team_explo_era"
},

/* =====================================================================
   HOME PAGE  (book.html)
   ===================================================================== */
home: {
  pageTitle: "KREM CHYMPE",
  metaDescription: "Krem Chympe: cave exploration, waterfalls, forest trekking, camping and homestay in East Jaintia Hills, Meghalaya.",
  shareTitle: "KREM CHYMPE",
  shareDescription: "Explore Krem Chympe at your own pace.",

  /* --- top picture area --- */
  heroImageAlt: "Krem Chympe cave and waterfall",
  heroTitle: "Krem Chympe — Destination Information",
  logoAria: "Team Explo Era, Adventure Era Awaits",
  logoText: "TEAM\nEXPLO ERA",
  heroHeading: "EXPLORE KREM CHYMPE\nAT YOUR OWN PACE",
  bookNow: "Book now",
  policyLink: "POLICY",

  /* --- first section --- */
  aboutHeading: "A Natural Destination Like No Other",
  aboutText: "Krem Chympe is a natural destination offering cave exploration, waterfalls, underground water, forest trekking and local adventure experiences.\n\nLocal Guide: David Tariang, Brichyrnot village.\nLanguages: English, Hindi and local language.",

  /* --- services --- */
  servicesHeading: "Our Services",
  servicesText: "We offer cave exploration, waterfall visits, forest trekking, 4×4 off-road travel, bamboo rafting, camping, homestay and local food experiences.",

  /* --- the three package cards (their names are in the PACKAGES section below) --- */
  packagesAria: "Our experiences. Tap one to see its video.",
  packagesNote: "More experiences coming soon.",
  viewAll: "View all",
  viewAllWithCount: "View all ({count})",
  showLess: "Show less",
  openCardAria: "Open {name} video and details",

  /* --- pop-up that opens when a package card is tapped --- */
  popupAria: "Experience video and details",
  closeAria: "Close",
  sliderAria: "Video position",
  popupHint: "Swipe the video or drag the slider to go back and forward.",
  popupBook: "Book now",
  popupHighlights: "Highlights",
  priceFrom: "From {price} / person",
  priceFromNight: "From {price} / night",
  priceCustom: "Fully customisable",

  /* --- Whole-page background + round picture selector (top of the page) ---
     Every item below = one round picture AND one full-page background. Add more any time, the round pictures slide.
     name  = label next to the round picture       desc = short text shown in the top section
     image = round picture (also the background if there is no video)   e.g. "images/place-1.jpg"
     video = (optional) video file name inside the videos folder WITHOUT .mp4, e.g. "scene-1" = videos/scene-1.mp4 (+ scene-1.jpg)
     sub   = (optional) small second line under the name, like the country in the reference
     pos   = (optional) which part of the picture stays visible when cropped, e.g. "50% 40%"
     Scenes 1-3 are also the package videos (Private Tour, Camping, Wilderness Expedition). */
  nowViewing: "Now viewing",
  modeAria: "Where to show the background",
  modeSite: "Whole site",
  modeHero: "Hero only",
  navAria: "Main menu",
  navHome: "Home",
  navAbout: "About",
  navPackages: "Packages",
  navReviews: "Reviews",
  navContact: "Contact",
  exploreAria: "Pick a place to explore",
  exploreHandleAria: "Show places to explore",
  exploreHeading: "Explore Krem Chympe",
  explore: [
    { name: "Waterfall", sub: "Guided visit", video: "scene-1", pos: "50% 50%",
      desc: "Waterfall visits are part of every Krem Chympe trip. Your local guide shows you the best spots and keeps the group safe around the water. Water levels change with the season and weather." },
    { name: "Forest", sub: "Forest trails", video: "scene-2", pos: "50% 50%",
      desc: "Trek through the forest trails around Krem Chympe with a local guide. Guides speak English, Hindi and the local language." },
    { name: "Waterfall Pool", sub: "Swim and cool off", video: "scene-3", pos: "50% 50%",
      desc: "Cool off in the clear blue pool below the falls. Stay with your guide, wear shoes with good grip and mind the slippery rocks." }
  ],
  railCloseAria: "Hide the video picker",

  /* --- PHOTO GALLERY section (pictures only; has its own round pictures, separate from the hero videos) ---
     name = label   sub = small second line   image = picture file   desc = text under the big picture   pos = crop focus, e.g. "50% 40%"
     Add more any time: the round pictures slide (sideways on phones, up/down on computers). */
  navGallery: "Gallery",
  galleryHeading: "Photo Gallery",
  galleryText: "Tap a round picture to change the photo.",
  galleryAria: "Photo gallery. Pick a round picture to change the photo.",
  galleryPickAria: "Show photo: {name}",
  gallery: [
    { name: "Waterfall", sub: "Guided visit", image: "images/place-1.jpg", pos: "50% 50%", desc: "The falls at Krem Chympe, best seen with a local guide who knows the safe spots." },
    { name: "Forest", sub: "Forest trails", image: "images/place-2.jpg", pos: "50% 50%", desc: "Forest trails around Krem Chympe, walked at your own pace." },
    { name: "Waterfall Pool", sub: "Swim and cool off", image: "images/place-3.jpg", pos: "50% 50%", desc: "The clear blue pool below the falls. Stay with your guide and mind the slippery rocks." },
    { name: "River", sub: "Hanging bridge", image: "images/place-4.jpg", pos: "50% 50%", desc: "The hanging bridge over the river, or a bamboo raft on the water." },
    { name: "Cave", sub: "Cave and water", image: "images/place-5.jpg", pos: "50% 55%", desc: "Cave exploration with underground water. Wear sturdy shoes and bring a torch if you have one." }
  ],
  videoOpenAria: "Open {name} video full size",
  videoShrinkAria: "Shrink {name} video",

  /* --- "Trusted by" --- */
  trustedHeading: "Trusted by Travelers From",
  cities: ["GUWAHATI", "SHILLONG", "JOWAI", "CHERRAPUNJI"],

  /* --- rating box --- */
  rateHeading: "Rate your experience",
  rateHint: "Tap to rate and leave a comment",
  ratingAria: "Rating",
  oneStarAria: "1 star",
  manyStarsAria: "{n} stars",
  yourNamePlaceholder: "Your name (optional)",
  yourCommentPlaceholder: "Write your comment (optional)",
  nameAria: "Your name (optional)",
  commentAria: "Your comment (optional)",
  honeypotPlaceholder: "Leave empty",
  letterCount: "{n} / 300",
  submitFeedback: "Submit Feedback",
  feedbackHint: "Your comment will appear under What Our Travelers Say",
  tapStarFirst: "Tap a star to rate first.",
  sending: "Sending…",
  thanksWithComment: "Thank you! Your comment is now showing in What Our Travelers Say.",
  thanksNoComment: "Thank you for your feedback!",
  sendFailed: "Could not send. Please try again.",

  /* --- reviews --- */
  reviewsHeading: "What Our Travelers Say",
  reviewsAria: "Traveler reviews. Swipe sideways to read more.",
  previousAria: "Previous reviews",
  nextAria: "Next reviews",
  defaultReviewer: "Traveler",
  starsOutOfFiveAria: "{n} out of 5 stars",
  /* Add or remove reviews here. Each one is:  { quote: "...", by: "Name, Place" }  */
  reviews: [
    { quote: "The cave exploration and bamboo rafting were incredible. David was an excellent guide who knew the terrain perfectly.", by: "Rahul S., Guwahati" },
    { quote: "Booked the Wilderness Expedition. The 4x4 off-roading and the river camp were the highlights.", by: "Anjali D., Kolkata" },
    { quote: "A truly raw and beautiful experience. The homestay was comfortable, and the local food was amazing.", by: "David M., UK" }
  ],

  /* --- bottom of the page --- */
  contactHeading: "Get in Touch",
  address: "Brishyrnot East Jaintia Hills\nlumshnong 321000 MEGHALAYA",
  instagramAria: "Instagram @shiningcars",
  telLabel: "Tel.",
  emailLabel: "Email:",
  socialLabel: "Social:",
  respectNote: "Visitors must respect local communities, wildlife and the natural environment. All activities depend on weather and safety conditions."
},

/* =====================================================================
   THE THREE PACKAGES
   Used on the home page cards AND all 5 booking pages.
   (The numbers/prices are in pricing.json.)
   ===================================================================== */
packages: {

  private: {
    name: "Krem Chympe Tour",
    tagline: "A private guided day at Krem Chympe, built your way.",
    dateLabel: "Tour date",
    optionsHeading: "Build your tour",
    childNote: "",
    notes: [
      "Fully customisable: a local guide is required, everything else is optional.",
      "Tap an item to read what it includes, then tick what you want."
    ],
    description: "A private guided day at Krem Chympe, just for your group. Best for families, friends and small groups who want to explore the cave and waterfalls at their own pace, with no other groups and no rush. You choose what to add: a 4×4 jeep, adventure activities, lunch, or an overnight camping stay with bamboo-cooked dishes. Every booking includes a local guide.",
    info: [
      ["Best for", "Families, friends and small groups who want a private, flexible day"],
      ["Includes", "Local guide (required), your own group only, forest trek to the cave and waterfall"],
      ["Activities", "700m cave exploration, bamboo rafting, cave and waterfall swimming, cave cliff jumping, Khaddum (Chympe) waterfall visit (optional add-on)"],
      ["Facilities", "Life jacket, basic first aid, entry fee (with activities); optional 4×4 jeep, lunch thalis, camping tents and bamboo dishes"],
      ["Conditions", "Without the jeep the trek is about 20 km round trip. If weather or safety stops an activity, only the entry fee and life jacket are charged. Camping needs an overnight guide. Booking is confirmed after the advance."],
      ["Language", "English, Hindi, local language"],
      ["Location", "Krem Chympe, East Jaintia Hills, Meghalaya"]
    ],
    highlightsLabel: "Choose what you want",
    highlights: ["Local guide (required)", "4×4 jeep (optional)", "Adventure activities (optional)", "Lunch thalis (optional)", "Camping with bamboo dishes (optional)"],
    options: {
      jeep: { label: "4×4 Jeep", details: "A 4×4 jeep takes your group along the forest track. It is charged per group, not per person.", note: "Without the 4×4 jeep, the trekking distance is about 20 km (round trip)." },
      guide: { label: "Local Guide", details: "A local guide is required for all visitors because this is an offbeat destination. The guide keeps you safe through every activity.", note: "The guide is charged per group, not per person." },
      activities: {
        label: "Adventure Activities & Facilities",
        details: "The full adventure day, priced per person.",
        includes: ["Guide", "Life jacket", "Basic first aid", "Entry fee included", "Scenic forest drive and forest trek", "Bridge viewpoint", "Private bamboo rafting", "700m cave exploration", "Cave cliff jumping", "Cave swimming", "Khaddum (Chympe) waterfall visit", "Waterfall swimming"],
        note: "If activities cannot run because of weather or safety, only the entry fee and life jacket fee are charged."
      },
      lunch: { label: "Lunch", details: "Pick your thalis and the quantity of each. Includes chutney and pickle.", note: "All thali variants are priced the same.", items: { veg: "Veg Thali", chicken: "Chicken Thali", pork: "Pork Thali" } },
      camping: { label: "Camping", details: "Overnight camping stay at the campsite. Tick this to add a tent, camping meals, an overnight guide and bamboo dishes below." },
      tent: { label: "Camping Tent Rental", details: "Choose the number of tents.", includes: ["Blanket", "Pillows", "Camping chairs"], note: "One tent comfortably fits 2 people. Priced per tent.", items: { tent: "Tent (sleeps 2)" } },
      meals: { label: "Camping Meals", details: "Dinner: veg thali. Breakfast: 2 servings of Maggi.", note: "Vegetarian meals only." },
      overnight: { label: "Overnight Guide", details: "Required for all camping bookings because the campsite is far from the nearest village. The guide also prepares your dinner and breakfast.", note: "Camping without a guide is not allowed. Charged ₹2,000 per night." },
      bamboo: { label: "Traditional Bamboo Dishes", details: "Zero-oil bamboo-cooked dishes, available only with camping because they need extra preparation time and fresh ingredients.", items: { bchicken5: "Bamboo Chicken (500g)", bchicken1: "Bamboo Chicken (1kg)", bpork5: "Bamboo Pork (500g)", bpork1: "Bamboo Pork (1kg)", bbelly5: "Roasted Pork Belly Salad (500g)", bbelly1: "Roasted Pork Belly Salad (1kg)", bfish: "Boiled Fish (Zero Oil)", bveg: "Veg Bamboo Sabji", begg: "Boiled Egg", bchai: "Bamboo Chai" } }
    }
  },

  camping: {
    name: "Krem Chympe Camping",
    tagline: "Stay overnight in the wild at Krem Chympe.",
    dateLabel: "Check-in date",
    optionsHeading: "Camping add-ons",
    childNote: "",
    notes: [
      "The overnight guide is required and costs ₹2,000 per night. Add tents, meals and bamboo dishes below.",
      "Tents are charged per tent (each sleeps 2); meals and bamboo dishes are charged as shown."
    ],
    description: "An overnight camping stay in the wild at Krem Chympe. Best for friends, couples and families who want to sleep under the stars beside the forest and enjoy traditional bamboo-cooked food. The overnight guide is required for your safety and costs ₹2,000 per night. You pick your tents, meals and bamboo dishes on the next page.",
    info: [
      ["Best for", "Friends, couples and families who want a night in the wild"],
      ["Includes", "Camping stay with an overnight guide (required, ₹2,000 per night)"],
      ["Activities", "Campfire evening, forest surroundings, bamboo-cooked dinner (optional)"],
      ["Facilities", "Tents with blanket, pillows and camping chairs (1 tent fits 2 people), camping meals, bamboo dishes"],
      ["Conditions", "Overnight guide is required, camping meals are vegetarian only, bamboo dishes are available only with camping. The overnight guide is ₹2,000 per night. Booking is confirmed after the advance."],
      ["Language", "English, Hindi, local language"],
      ["Location", "Krem Chympe, East Jaintia Hills, Meghalaya"]
    ],
    highlightsLabel: "Choose on the next page",
    highlights: ["Tent rental", "Camping meals", "Overnight guide, ₹2,000/night (required)", "Bamboo dishes"],
    options: {
      tent: { label: "Camping Tent Rental", details: "Choose the number of tents.", includes: ["Blanket", "Pillows", "Camping chairs"], note: "One tent comfortably fits 2 people. Priced per tent.", items: { tent: "Tent (sleeps 2)" } },
      meals: { label: "Camping Meals", details: "Dinner: veg thali. Breakfast: 2 servings of Maggi.", note: "Vegetarian meals only." },
      overnight: { label: "Overnight Guide", details: "Required for all camping bookings because the campsite is far from the nearest village. The guide also prepares your dinner and breakfast.", note: "Camping without a guide is not allowed. Charged ₹2,000 per night." },
      bamboo: { label: "Traditional Bamboo Dishes", details: "Zero-oil bamboo-cooked dishes, available only with camping because they need extra preparation time and fresh ingredients.", items: { bchicken5: "Bamboo Chicken (500g)", bchicken1: "Bamboo Chicken (1kg)", bpork5: "Bamboo Pork (500g)", bpork1: "Bamboo Pork (1kg)", bbelly5: "Roasted Pork Belly Salad (500g)", bbelly1: "Roasted Pork Belly Salad (1kg)", bfish: "Boiled Fish (Zero Oil)", bveg: "Veg Bamboo Sabji", begg: "Boiled Egg", bchai: "Bamboo Chai" } }
    }
  },

  expedition: {
    name: "Wilderness Expedition",
    tagline: "The complete six-day wilderness expedition, guide-led.",
    dateLabel: "Expedition date",
    optionsHeading: "Expedition extras",
    notes: [
      "Price is per person. Maximum {maxPeople} people per booking.",
      "Advance must be paid at least {days} days before the expedition.",
      "Cancel at least 7 days before the expedition date."
    ],
    inclusions: [
      "Guided expedition (guide-led route management)",
      "4×4 transfer, Brichyrnot to Khaddum",
      "5 nights wilderness camping and camping equipment",
      "Meals and drinking water",
      "Waterfall exploration and jungle trekking",
      "First-aid support and expedition navigation"
    ],
    description: "A six-day guided wilderness expedition for people who want to go deep into the Meghalaya wilderness. Best for fit, adventurous travellers and small groups of up to 5. The price is per person and covers the guide, 4×4 transfer, five nights of camping with equipment, meals, drinking water and first-aid support.",
    info: [
      ["Best for", "Fit, adventurous travellers and small groups"],
      ["Includes", "Guide-led route, 4×4 transfer Brichyrnot to Khaddum, 5 nights camping with equipment, meals, drinking water"],
      ["Activities", "Waterfall exploration, jungle trekking, expedition navigation"],
      ["Facilities", "Camping equipment, first-aid support, drinking water"],
      ["Conditions", "Max 5 people per booking. Advance at least {days} days before. Cancel at least 7 days before. Route and itinerary can change with weather, water levels, terrain or safety."],
      ["Extra days", "Optional: ₹1,000 per person per day"],
      ["Location", "Krem Chympe, East Jaintia Hills, Meghalaya"]
    ],
    highlightsLabel: "Everything included",
    options: {
      extraday: { label: "Additional days (optional)", details: "Extend your expedition beyond the standard 6 days, subject to conditions and availability.", note: "Charged per person per day.", items: { day: "Extra day" } }
    }
  }
},

/* =====================================================================
   PAYMENT DETAILS  (shown on booking Page 4)
   ===================================================================== */
payment: {
  payeeName: "Krem Chympe Adventure & Camping",
  upiId: "8787679579@ybl",
  qrImage: "images/payment-qr.png",          /* put your QR picture in the images folder with this name */
  /* Bank rows. Add, remove or rename rows freely:  ["Name shown", "Value shown"],  */
  bankRows: [
    ["Account name", "Your Account Name"],
    ["Account number", "0000000000"],
    ["IFSC", "XXXX0000000"],
    ["Bank", "Your Bank"],
    ["Branch", "Your Branch"]
  ]
},

/* =====================================================================
   BOOKING PAGES  (reserve.html)  — pages 1 to 5
   ===================================================================== */
booking: {
  pageTitle: "Book your trip | Krem Chympe Adventure & Camping",
  metaDescription: "Book a Krem Chympe Tour, Krem Chympe Camping or the Wilderness Expedition in a few quick steps.",
  homeLink: "← Home",
  brand: "Krem Chympe",
  loading: "Loading…",
  loadFailed: "Could not load the booking form. Please refresh or call",
  tryAgainCall: "Please try again or call",
  sentenceEnd: ".",
  chooseHeading: "Choose your package",
  changePackageAria: "Change package",
  back: "Back",
  next: "Next page",

  /* ---- Page 1: Details ---- */
  page1Heading: "Your details",
  labelName: "Name",
  labelWhatsapp: "WhatsApp number",
  labelPeople: "Number of people",
  labelChildren: "Children",
  labelRequest: "Special request (optional)",
  childPricing: "Children pricing: {price} per child. {note}",
  inclusionsHeading: "Expedition inclusions",
  priceLine: "Price: {price} per person",

  /* ---- Page 2: Options ---- */
  perPerson: "/ person",
  flatPrice: "flat",
  chooseItems: "choose items",
  required: "required",
  includesLabel: "Includes:",
  detailsAria: "Show or hide details for {name}",
  eachPrice: "{price} each",
  fewerAria: "Fewer {name}",
  moreAria: "More {name}",
  fewerPeopleAria: "Fewer people",
  morePeopleAria: "More people",
  estimatedTotal: "Estimated total ({people} × {price})",

  /* ---- Page 3: Pricing ---- */
  page3Heading: "Pricing",
  adults: "Adults",
  children: "Children",
  flatRate: "Flat rate",
  total: "Total",

  /* ---- Page 4: Payment ---- */
  page4Heading: "Payment",
  orderSummary: "Order summary",
  summaryPackage: "Package",
  summaryDate: "Date",
  summaryGuests: "Guests",
  summaryTotal: "Total",
  guestsOnly: "{adults}",
  guestsWithOneChild: "{adults} + {kids} child",
  guestsWithChildren: "{adults} + {kids} children",
  tabQr: "QR",
  tabUpi: "UPI",
  tabBank: "Bank transfer",
  qrAlt: "Payment QR code",
  qrMissing: "QR code not available. Please use UPI or bank transfer.",
  upiIdLabel: "UPI ID",
  payeeLabel: "Payee",
  upiButton: "Pay with UPI app",
  upiNote: "{package} advance",
  advanceLabel: "Advance payment (₹)",
  balanceLabel: "Balance to pay later",

  /* ---- Page 5: Upload & submit ---- */
  page5Heading: "Upload receipt & submit",
  receiptLabel: "Payment receipt or screenshot (image or PDF)",
  receiptPreviewAlt: "Receipt preview",
  selectedFile: "Selected: {name}",
  agreeBefore: "I have read and accept the",
  agreeLink: "Cancellation Policy",
  agreeAfter: ".",
  submit: "Submit booking",
  sending: "Sending…",

  /* ---- Messages shown when something is wrong ---- */
  errName: "Enter your name.",
  errWhatsapp: "Enter a valid WhatsApp number.",
  errDateMissing: "Choose a date.",
  errDatePast: "Choose a future date.",
  errDateExpedition: "This package must be booked at least {days} days ahead.",
  errPeople: "Enter 1 to {max} people.",
  errChildren: "Enter 0 to {max} children.",
  errAdvance: "Advance must be between {min} and {max}.",
  errItems: "Choose at least one item for: {list} (or untick it).",
  errReceipt: "Please upload your payment receipt.",
  errAgree: "Please accept the Cancellation Policy.",
  errPdfTooBig: "PDF is too large (max 1.5 MB). Please upload a screenshot instead.",
  errNotImage: "Please choose an image or a PDF.",
  errImageRead: "Could not read that image.",
  errSendFailed: "Could not send your booking.",

  /* Messages that can come back from the server (rarely seen) */
  serverErrors: {
    package: "Choose a package.",
    json: "Invalid request. Please refresh and try again.",
    name: "Name is required.",
    whatsapp: "Enter a valid WhatsApp number.",
    people: "Enter a valid number of people.",
    children: "Enter a valid number of children.",
    date: "Choose a date.",
    datePast: "Choose a future date.",
    dateExpedition: "This package must be booked further ahead. Please choose a later date.",
    advance: "The advance amount is not valid.",
    agree: "You must accept the Cancellation Policy.",
    receipt: "A payment receipt (image or PDF, under about 1.5 MB) is required.",
    items: "Please choose at least one item for each ticked option."
  },

  /* ---- After a successful booking ---- */
  doneHeading: "We have received your booking!",
  doneText: "Thank you for booking the {package}. We will verify your payment and confirm on WhatsApp shortly.",
  doneIdLabel: "Your booking ID",
  callButton: "Call {phone}",
  backToMain: "Back to main page"
},

/* =====================================================================
   CANCELLATION POLICY PAGE  (terms.html)
   ===================================================================== */
policy: {
  pageTitle: "Cancellation Policy | Krem Chympe Adventure & Camping",
  metaDescription: "Cancellation policy for Krem Chympe Adventure & Camping bookings.",
  backAria: "Go back",
  topHeading: "Cancellation Policy",
  topSub: "Please read this before you pay your advance.",
  bigTitle: "CANCELLATION POLICY",
  subTitle: "Krem Chympe Adventure & Camping",
  /* Each box has a title and a list of points. Add, remove or change freely.
     (The minimum advance and expedition days are filled in from pricing.json automatically.) */
  sections: [
    { title: "1. Advance Payment", points: [
      "Booking is confirmed only after advance payment.",
      "Minimum advance is {minAdvance}.",
      "Advance payment is refundable only as described in section 2."
    ]},
    { title: "2. Cancellation by Visitor", points: [
      "If cancelled 7 days or more before the booking date — 50% of advance refunded.",
      "If cancelled 3 to 6 days before the booking date — 25% of advance refunded.",
      "If cancelled less than 3 days before the booking date — no refund.",
      "No refund for no-show."
    ]},
    { title: "3. Expedition Package", points: [
      "Expedition Package must be cancelled at least 7 days before the expedition date.",
      "Advance booking for the Expedition Package must be completed at least {expedition.days} days before the expedition.",
      "No refund for cancellation less than 7 days before the expedition.",
      "The Expedition price is {expedition.adult} per person (maximum {expedition.max} people per booking). Extra days, if added, are charged per person per day."
    ]},
    { title: "4. Camping & Additional Services", points: [
      "An overnight guide is required for all camping and is charged at {camping.night} per night.",
      "Tents are charged per tent, and camping meals and bamboo dishes are charged as shown on the booking page.",
      "Refund eligibility for these services depends on whether the service has already been provided or whether non-refundable arrangements have already been made."
    ]},
    { title: "5. Cancellation by Krem Chympe", points: [
      "If activities cannot be conducted due to weather, water levels, route conditions, or safety conditions — the booking may be postponed or cancelled.",
      "If cancelled by Krem Chympe, the advance payment will be refunded or adjusted to a new date."
    ]},
    { title: "6. Changes", points: [
      "Changes to date, group size, or selected services must be communicated in advance.",
      "Changes are subject to availability."
    ]},
    { title: "7. Refunds", points: [
      "Refunds will be processed within 7 working days.",
      "Refund will be made to the same payment method used for the advance payment."
    ]}
  ]
},

/* =====================================================================
   OWNER'S BOOKINGS PAGE  (admin.html)  — only you see this page
   ===================================================================== */
admin: {
  pageTitle: "Bookings | Krem Chympe",
  loginHeading: "Admin login",
  passwordLabel: "Password",
  signIn: "Sign in",
  wrongPassword: "Wrong password.",
  bookingsHeading: "Bookings",
  refresh: "Refresh",
  signOut: "Sign out",
  loading: "Loading…",
  requestFailed: "Request failed",
  bookingHeaders: ["ID", "Customer", "Package", "Date & guests", "Payment", "Receipt", "Status", "Actions"],
  reviewsHeading: "Reviews",
  reviewHeaders: ["Date", "Stars", "Name", "Comment", "Actions"],
  noBookings: "No bookings yet.",
  noReviews: "No reviews yet.",
  noName: "(no name)",
  ratingOnly: "(rating only)",
  requestLine: "Request: {text}",
  peopleLine: "{n} people",
  peopleWithChildrenLine: "{n} people + {kids} children",
  totalLine: "Total {amount}",
  advanceLine: "Advance {amount} ({method})",
  balanceLine: "Balance {amount}",
  receiptAlt: "Receipt",
  downloadPdf: "Download PDF",
  statusLabels: { Pending: "Pending", Confirmed: "Confirmed", Completed: "Completed", Cancelled: "Cancelled" },
  statusChanged: "{id} set to {status}.",
  deleteButton: "Delete",
  confirmDeleteBooking: "Delete booking {id}? This cannot be undone.",
  bookingDeleted: "{id} deleted.",
  confirmDeleteReview: "Remove this review from the website?",
  reviewRemoved: "Review removed."
},

/* ---------- The page that quickly sends visitors to the home page ---------- */
start: {
  pageTitle: "Krem Chympe Adventure & Camping",
  continueLink: "Continue"
}

};

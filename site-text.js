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
   ===================================================================== */

window.TEXT = {

/* ---------- Used everywhere ---------- */
common: {
  currency: "₹"
},

/* ---------- Phone, email, Instagram (used on several pages) ---------- */
contact: {
  phoneShow: "91 8787679579",            /* how the number looks on screen */
  phoneForLink: "+918787679579",         /* same number, no spaces, with country code (used when someone taps it) */
  email: "shiningbikerental@gmail.com",
  instagramUrl: "https://instagram.com/shiningcars",
  instagramHandle: "@shiningcars"
},

/* =====================================================================
   HOME PAGE  (book.html)
   ===================================================================== */
home: {
  pageTitle: "Krem Chympe — Destination Information",
  metaDescription: "Krem Chympe: cave exploration, waterfalls, forest trekking, camping and homestay in East Jaintia Hills, Meghalaya.",
  shareTitle: "Krem Chympe — Destination Information",
  shareDescription: "Explore Krem Chympe at your own pace.",

  /* --- top picture area --- */
  heroImageAlt: "Krem Chympe cave and waterfall",
  heroTitle: "Krem Chympe — Destination Information",
  logoAria: "Shining Bike Rentals, back to top",
  logoText: "Shining Bike\nRentals",
  heroHeading: "EXPLORE KREM CHYMPE\nAT YOUR OWN PACE",
  bookNow: "Book now",
  policyLink: "Cancellation Policy",

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

  /* --- Explore section (two videos) --- */
  exploreHeading: "Explore Krem Chympe",
  video1Name: "Cave and Waterfall",
  video2Name: "Forest and River",
  videoOpenAria: "Open video full size",
  videoShrinkAria: "Shrink video",

  /* --- "Trusted by" --- */
  trustedHeading: "Trusted by Travelers From",
  cities: ["GUWAHATI", "SHILLONG", "JOWAI", "CHERRAPUNJI"],

  /* --- rating box --- */
  rateHeading: "Rate your experience",
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
    name: "Private Tour",
    tagline: "A private guided day in Krem Chympe, just for your group.",
    dateLabel: "Tour date",
    optionsHeading: "Private Tour options",
    childNote: "Children (under 12) are charged half price.",
    notes: [
      "Private tour for your own group only.",
      "Pick any extras you like on the next page."
    ],
    /* Extra lines in the pop-up on the home page. Example:  ["Duration", "Full day"],  */
    info: [],
    /* Names of the extras (Page 2). Keep the short names on the left (jeep, guide...) as they are. */
    options: {
      jeep:       { label: "4×4 Jeep" },
      guide:      { label: "Local Guide" },
      activities: { label: "Adventure Activities" },
      lunch:      { label: "Lunch", items: { veg: "Veg Thali", chicken: "Chicken Thali", pork: "Pork Thali" } },
      camping:    { label: "Camping", details: "Camping details: overnight stay in the wild. Add tent, guide and bamboo dishes below." },
      tent:       { label: "Tent Rental" },
      meals:      { label: "Meals" },
      overnight:  { label: "Overnight Guide" },
      bamboo:     { label: "Bamboo Dishes", items: { bchicken: "Bamboo Chicken", bpork: "Bamboo Pork", bfish: "Bamboo Fish", bveg: "Bamboo Veg", brice: "Bamboo Rice" } }
    }
  },

  camping: {
    name: "Camping Package",
    tagline: "Stay overnight in the wild at Krem Chympe.",
    dateLabel: "Check-in date",
    optionsHeading: "Camping Package options",
    childNote: "Children (under 12) are charged half price.",
    notes: [
      "Overnight camping stay.",
      "Choose tent, meals and guide on the next page."
    ],
    info: [],
    options: {
      tent:      { label: "Tent Rental" },
      meals:     { label: "Meals" },
      overnight: { label: "Overnight Guide" },
      bamboo:    { label: "Bamboo Dishes", items: { bchicken: "Bamboo Chicken", bpork: "Bamboo Pork", bfish: "Bamboo Fish", bveg: "Bamboo Veg", brice: "Bamboo Rice" } }
    }
  },

  expedition: {
    name: "Wilderness Expedition",
    tagline: "The full multi-day expedition, everything included.",
    dateLabel: "Expedition date",
    optionsHeading: "Group size",
    notes: [
      "Fixed price per person, all inclusions below are covered.",
      "Advance must be paid at least 3 days before the expedition.",
      "Cancel at least 7 days before the expedition date."
    ],
    inclusions: [
      "4×4 Jeep transfers",
      "Local expert guide",
      "Adventure activities",
      "Camping and tent",
      "All meals",
      "Bamboo dishes"
    ],
    info: [],
    options: {}
  }
},

/* =====================================================================
   PAYMENT DETAILS  (shown on booking Page 4)
   ===================================================================== */
payment: {
  payeeName: "Krem Chympe Adventure & Camping",
  upiId: "yourname@upi",
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
  metaDescription: "Book a Krem Chympe Private Tour, Camping Package or Wilderness Expedition in a few quick steps.",
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
  errDateExpedition: "Expedition bookings must be made at least 3 days ahead.",
  errPeople: "Enter 1 to 50 people.",
  errChildren: "Enter 0 to 50 children.",
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
    dateExpedition: "Expedition bookings must be made at least 3 days ahead.",
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
     (If you change the minimum advance, also change it in pricing.json.) */
  sections: [
    { title: "1. Advance Payment", points: [
      "Booking is confirmed only after advance payment.",
      "Minimum advance is ₹1,000.",
      "Advance payment is non-refundable."
    ]},
    { title: "2. Cancellation by Visitor", points: [
      "If cancelled 7 days or more before the booking date — 50% of advance refunded.",
      "If cancelled 3 to 6 days before the booking date — 25% of advance refunded.",
      "If cancelled less than 3 days before the booking date — no refund.",
      "No refund for no-show."
    ]},
    { title: "3. Expedition Package", points: [
      "Expedition Package must be cancelled at least 7 days before the expedition date.",
      "Advance booking for the Expedition Package must be completed at least 3 days before the expedition.",
      "No refund for cancellation less than 7 days before the expedition."
    ]},
    { title: "4. Cancellation by Krem Chympe", points: [
      "If activities cannot be conducted due to weather, water levels, route conditions, or safety conditions — the booking may be postponed or cancelled.",
      "If cancelled by Krem Chympe, the advance payment will be refunded or adjusted to a new date."
    ]},
    { title: "5. Changes", points: [
      "Changes to date, group size, or selected services must be communicated in advance.",
      "Changes are subject to availability."
    ]},
    { title: "6. Refunds", points: [
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

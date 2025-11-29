// DownloadAppSection.jsx
export default function DownloadAppSection() {
  return (
    <section className="w-full bg-[#EAE6F6] py-12 px-4 md:px-12 my-5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* ---------- Left Section ---------- */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Download IcchhaPurti Mobile App
          </h2>

          <ul className="space-y-4 text-lg text-gray-700">
            <li className="flex gap-3">
              <span className="text-yellow-600 text-2xl">✔</span> Lorem ipsum dolor sit amet consectetur. Risus.
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-600 text-2xl">✔</span> Lorem ipsum dolor sit amet consectetur. Nec.
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-600 text-2xl">✔</span> Lorem ipsum dolor sit amet consectetur. Eget.
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-600 text-2xl">✔</span> Lorem ipsum dolor sit amet consectetur. Tellus.
            </li>
          </ul>

          <p className="text-xl font-semibold mt-6 text-gray-800">
            Get Best User Experience And More…
          </p>

          {/* App Buttons */}
          <div className="flex gap-4 mt-5">
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="Google Play"
              className="w-40 cursor-pointer"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="App Store"
              className="w-40 cursor-pointer"
            />
          </div>
        </div>

        {/* ---------- Right Section (Phone Image) ---------- */}
        <div className="flex justify-center md:justify-end">
          <img
            src="/mobile.png" // place your phone mockup image here
            alt="Mobile App"
            className="w-[350px] md:w-[500px] drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}

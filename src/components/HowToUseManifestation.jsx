export default function HowToUseManifestation() {
  return (
    <div className=" flex my-8 flex-col items-center px-4">

      {/* Heading */}

      {/* Main Card */}
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-2xl overflow-hidden mx-auto">

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-7">



          {/* Left – Content (2/3) */}
          <div className="lg:col-span-4   bg-gradient-to-br from-gray-50 to-amber-50">

            <div className="bg-[#0a2540] mb-3 py-4 ">
              <h2
                className=" text-center text-lg md:text-2xl font-extrabold bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, #7a5c00 0%, #f6e27a 15%, #fff6b0 30%, #d4af37 45%, #fff6b0 60%, #f6e27a 75%, #7a5c00 100%)",
                  backgroundSize: "200% 200%",
                  animation: "goldShine 3s linear infinite",
                }}
              >
                HOW TO USE ICCHHAPURTI MANIFESTATION PEN
              </h2>
            </div>




            <ul className="space-y-5 p-5 text-gray-900">

              <li className="">
                <h4 className="font-bold text-yellow-600 text-lg mb-1 ">
                  🧘‍♂️ Prepare Your Mind
                </h4>



                <p className="font-semibold">
                  Hold the Icchhapurti Pen comfortably and take a deep breath to calm your mind.
                </p>
              </li>

              <li>
                <h4 className="font-bold text-yellow-600 text-lg mb-1">
                  🎯 Clarify Your Goal
                </h4>
                <p className="font-semibold">
                  Think clearly about your goal, intention, or task before you start writing.
                </p>
              </li>

              <li>
                <h4 className="font-bold text-yellow-600 text-lg mb-1">
                  ✍️ Write With Intent
                </h4>
                <p className="font-semibold">
                  Write your goals, affirmations, or work plans with focus and positivity in the
                  present tense.
                </p>
              </li>

              <li>
                <h4 className="font-bold text-yellow-600 text-lg mb-1">
                  🔁 Be Consistent
                </h4>
                <p className="font-semibold">
                  Use the Icchhapurti Pen regularly to build consistency, clarity, and confidence in
                  your daily routine.
                </p>
              </li>

              <li>
                <h4 className="font-bold text-yellow-600 text-lg mb-1">
                  🙏 Practice Gratitude
                </h4>
                <p className="font-semibold">
                  Do not forget to express gratitude to the universe.
                </p>
              </li>

              <li>
                <h4 className="font-bold text-yellow-600 text-lg mb-1">
                  🌟 Trust The Process
                </h4>
                <p className="font-semibold">
                  Take aligned action, believe in what you do, and trust the process.
                </p>
              </li>

            </ul>

            {/* Closing CTA */}
            {/* <div className="mt-8 bg-gray-900 text-white rounded-2xl p-5 text-center shadow-xl">
              <p className="text-xl font-bold mb-2">
                WRITE WITH FAITH
              </p>
              <p className="text-xl font-semibold">
                AND LET THE UNIVERSE RESPOND ✨
              </p>
            </div> */}

          </div>

          {/* Right – Image (1/3) */}
          <div className="relative h-84 sm:h-80 lg:h-auto lg:col-span-3">
            <img
              src="/how_to_use.jpg"
              alt="How to Use Manifestation Pen"
              className="w-full h-full "
            />
          </div>

        </div>
      </div>
    </div>
  );
}

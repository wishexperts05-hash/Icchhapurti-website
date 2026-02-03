export default function ManifestationInfo() {
  return (
    <div className="flex flex-col my-8 items-center px-4">

      {/* Heading */}
      {/* <h2
        className="my-10 text-center text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(120deg, #7a5c00 0%, #f6e27a 15%, #fff6b0 30%, #d4af37 45%, #fff6b0 60%, #f6e27a 75%, #7a5c00 100%)",
          backgroundSize: "200% 200%",
          animation: "goldShine 3s linear infinite",
        }}
      >
        What Is The Manifestation
      </h2> */}

      {/* Main Card */}
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden mx-auto">

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-7">

          {/* Left – Image (1/3) */}
          <div className="relative h-84 sm:h-80 lg:h-auto lg:col-span-3">
            <img
              src="/manifestion.jpg"
              alt="Manifestation Meditation"
              className="w-full h-full "
            />
          </div>

          {/* Right – Content (2/3) */}
          <div className="lg:col-span-4  bg-gradient-to-br from-gray-50 to-amber-50">


            <div className="bg-[#0a2540] mb-3 py-4 ">
              <h2
                className=" text-center text-lg md:text-3xl font-extrabold bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, #7a5c00 0%, #f6e27a 15%, #fff6b0 30%, #d4af37 45%, #fff6b0 60%, #f6e27a 75%, #7a5c00 100%)",
                  backgroundSize: "200% 200%",
                  animation: "goldShine 3s linear infinite",
                }}
              >
                What Is Manifestation ?
              </h2>
            </div>
            <div className="p-5">



              <p className="text-md text-gray-900 font-semibold mb-3 leading-relaxed text-center lg:text-left">
                Manifestation is the process of turning your thoughts and beliefs into reality through
                focused intention and aligned action.
              </p>

              <p className="text-md text-gray-900 font-semibold mb-3 leading-relaxed text-center lg:text-left">
                When you focus clearly, believe deeply, and take action, the universe responds.
              </p>

              <div className="rounded-2xl p-4 mb-4">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 text-center">
                  SIMPLY
                </h3>
                <p className="text-md font-bold text-gray-900 text-center">
                  THINK + FEEL + BELIEVE + ACT = MANIFESTATION
                </p>
              </div>

              <div className="space-y-3 mb-5 text-center lg:text-left">
                <p className="text-md text-gray-900 font-bold">
                  Scripting / Writing Manifestation is the most powerful form of manifestation.
                </p>

                <p className="text-md text-gray-900 font-semibold">
                  Writing is not just words, it is energy in action.
                </p>

                <p className="text-md text-gray-900 font-semibold">
                  It works when you write your desires, not just think about them.
                </p>
              </div>

              <div className="bg-gray-900 text-white rounded-2xl p-5 text-center shadow-xl">
                <p className="text-xl font-bold mb-2">
                  SO DON'T JUST DREAM IT
                </p>
                <p className="text-xl font-semibold">
                  WRITE IT, BELIEVE IT, ACHIEVE IT...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

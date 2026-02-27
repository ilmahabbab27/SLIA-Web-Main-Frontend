const VideoSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
          Members' Work & Trade Exhibition
        </h2>
        <p className="text-muted-foreground text-center mb-8">Sri Lanka Institute of Architects</p>

        <div className="max-w-4xl mx-auto">
          <div className="relative w-full aspect-video rounded-sm overflow-hidden shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/6eM6V7Bxxo8"
              title="ARCHITECT 2024"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        <div className="mt-12 section-dark rounded-sm p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            Walk through the Architects' Work & Trade Exhibition
          </h3>
          <p className="text-section-dark-foreground/70 mb-6">
            23rd to 25th February, 2023 at BMICH from 10.00 am - 10.00 pm
          </p>
          <a
            href="#"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 font-semibold text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            Reserve Your Trade Stall
          </a>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;

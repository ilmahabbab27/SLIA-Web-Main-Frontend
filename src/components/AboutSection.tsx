import { Button } from "@/components/ui/button";

const AboutSection = () => {
  return (
    <section className="section-dark py-20">
      <div className="container">
        <p className="text-primary font-medium uppercase tracking-wider text-sm mb-2">About Us</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8">
          HISTORY — Sri Lanka Institute of Architects
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-5 text-section-dark-foreground/80 text-[15px] leading-relaxed">
            <p>
              The Sri Lanka Institute of Architects is one of the foremost professional organisations
              in Sri Lanka as well as the Asian region. The institute has been working on the
              professional practices of architecture in the country as well as education, which have
              been the primary focuses over the years.
            </p>
            <p>
              The Ceylon Institute of Architects (CIA) was established in 1956 by a small group of
              foreign qualified Architects following several meetings to work out a constitution.
              The Inaugural meeting of the institute was held on 11th September 1957 at the Tea
              Propaganda Board on Prince Street in the Colombo Fort with the participation of twelve
              Architects.
            </p>
            <p>
              In 1976, through a private member's motion by the then Minister of Housing and
              Construction, the Ceylon Institute of Architects was incorporated as the Sri Lanka
              Institute of Architects (SLIA) by an Act of Parliament, called the Sri Lanka Institute
              of Architects Law No.1 of 1976.
            </p>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground mt-4">
              Learn More
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-xl font-semibold mb-3">About Us</h3>
              <p className="text-section-dark-foreground/70 text-sm leading-relaxed">
                The institute has been working on the professional practices of architecture in the
                country as well as education, which have been the primary focuses over the years. We
                are proud to note that we have seen a lot of improvements in the industry.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-semibold mb-3">
                The Role Of The SLIA In Architectural Education
              </h3>
              <p className="text-section-dark-foreground/70 text-sm leading-relaxed">
                Sri Lanka Institute of Architects Law No. 1 of 1976 enacted by the National State
                Assembly vested statutory powers with the SLIA. One of the main objectives of the
                SLIA is to promote and advance the study, practice and application of and Research
                in Architecture.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-semibold mb-3">
                Objectives Of The Institute
              </h3>
              <ul className="text-section-dark-foreground/70 text-sm leading-relaxed space-y-2">
                <li>• Promote and advance the study, practice and application of research in architecture</li>
                <li>• Organize, supervise and control the admission and professional education</li>
                <li>• Protect and promote the interest, status, welfare of the profession</li>
                <li>• Establish and maintain libraries, pension and benefit schemes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

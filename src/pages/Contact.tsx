import PageLayout from "@/components/PageLayout";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => (
  <PageLayout title="Contact Us" subtitle="Get in touch with the Sri Lanka Institute of Architects" breadcrumb="Contact Us">
    <section className="py-16">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Send us a message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="border border-border bg-background px-4 py-3 rounded-sm text-sm text-foreground focus:outline-none focus:border-primary" />
                <input type="text" placeholder="Last Name" className="border border-border bg-background px-4 py-3 rounded-sm text-sm text-foreground focus:outline-none focus:border-primary" />
              </div>
              <input type="email" placeholder="Email Address" className="w-full border border-border bg-background px-4 py-3 rounded-sm text-sm text-foreground focus:outline-none focus:border-primary" />
              <input type="text" placeholder="Subject" className="w-full border border-border bg-background px-4 py-3 rounded-sm text-sm text-foreground focus:outline-none focus:border-primary" />
              <textarea placeholder="Your Message" rows={5} className="w-full border border-border bg-background px-4 py-3 rounded-sm text-sm text-foreground focus:outline-none focus:border-primary resize-none" />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">Send Message</Button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-sm">Address</p>
                    <p className="text-muted-foreground text-sm">120/7, Vidya Mawatha, Colombo 07, Sri Lanka</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-sm">Phone</p>
                    <p className="text-muted-foreground text-sm">072 71 64 900</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-sm">Email</p>
                    <p className="text-muted-foreground text-sm">webmaster@architects.lk</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-sm overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.9029!2d79.8612!3d6.9015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTQnMDUuNCJOIDc5wrA1MScxNi4zIkU!5e0!3m2!1sen!2slk!4v1234567890"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="SLIA Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Contact;

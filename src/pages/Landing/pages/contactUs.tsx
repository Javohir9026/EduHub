import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-scree py-20">
      <div className="container mx-auto px-6 lg:px-20">
        <h1 className="text-4xl lg:text-5xl font-bold text-center text-blue-800 mb-10">
          Biz bilan bog'lanish
        </h1>
        <p className="text-center text-black/70 mb-16 max-w-2xl mx-auto">
          Sizning savollaringiz yoki takliflaringiz bormi? Biz har doim yordam berishga tayyormiz. 
          Quyidagi shakl orqali biz bilan bog‘lanishingiz mumkin.
        </p>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Form */}
          <form className="flex-1 bg-white shadow-xl rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-black/70 font-medium mb-2">Ismingiz</label>
              <input
                type="text"
                placeholder="Ismingizni kiriting"
                className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-black/70 font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="Email manzilingiz"
                className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-black/70 font-medium mb-2">Xabar</label>
              <textarea
                placeholder="Xabaringizni yozing"
                className="w-full border border-blue-200 rounded-lg px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg">
              Yuborish
            </Button>
          </form>

          {/* Contact Info */}
          <div className="flex-1 space-y-8">
            <div className="bg-white shadow-xl rounded-2xl p-8 flex items-start gap-4">
              <MapPin className="text-black/70 w-6 h-6 mt-1" />
              <div>
                <h3 className="font-semibold text-black/70">Manzilimiz</h3>
                <p className="text-black/70">Toshkent sh., Chilonzor tumani, Amir Temur ko'chasi 12</p>
              </div>
            </div>

            <div className="bg-white shadow-xl rounded-2xl p-8 flex items-start gap-4">
              <Phone className="text-black/70 w-6 h-6 mt-1" />
              <div>
                <h3 className="font-semibold text-black/70">Telefon</h3>
                <p className="text-black/70">+998 90 123 45 67</p>
              </div>
            </div>

            <div className="bg-white shadow-xl rounded-2xl p-8 flex items-start gap-4">
              <Mail className="text-black/70 w-6 h-6 mt-1" />
              <div>
                <h3 className="font-semibold text-black/70">Email</h3>
                <p className="text-black/70">support@eduhub.uz</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

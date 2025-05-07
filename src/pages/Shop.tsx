import { useState } from "react";
import Layout from "../components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  isPrescribed: boolean;
  image: string;
  dosage: string;
}

const Shop = () => {
  const [cart, setCart] = useState<string[]>([]);
  
  const medicines: Medicine[] = [
    {
      id: "med1",
      name: "Lisinopril",
      description: "For blood pressure management",
      price: 12.99,
      isPrescribed: true,
      image: "/medicines/1.jpg",
      dosage: "10mg, once daily"
    },
    {
      id: "med2",
      name: "Metformin",
      description: "For diabetes management",
      price: 15.49,
      isPrescribed: true,
      image: "/medicines/2.jpg",
      dosage: "500mg, twice daily"
    },
    {
      id: "med3",
      name: "Vitamin D3",
      description: "Dietary supplement",
      price: 8.99,
      isPrescribed: false,
      image: "/medicines/3.jpg",
      dosage: "1000 IU, once daily"
    },
    {
      id: "med4",
      name: "Ibuprofen",
      description: "Pain reliever",
      price: 6.79,
      isPrescribed: false,
      image: "/medicines/4.jpg",
      dosage: "200mg, as needed"
    },
    {
      id: "med5",
      name: "Levothyroxine",
      description: "Thyroid medication",
      price: 14.25,
      isPrescribed: true,
      image: "/medicines/5.jpg",
      dosage: "75mcg, once daily"
    },
    {
      id: "med6",
      name: "Multivitamin Complex",
      description: "Daily vitamin supplement",
      price: 11.99,
      isPrescribed: false,
      image: "/medicines/6.jpg",
      dosage: "1 tablet, once daily"
    },
    {
      id: "med7",
      name: "Aspirin",
      description: "Pain reliever and blood thinner",
      price: 7.99,
      isPrescribed: false,
      image: "/medicines/7.jpg",
      dosage: "81mg, once daily"
    },
    {
      id: "med8",
      name: "Omeprazole",
      description: "Acid reflux medication",
      price: 16.99,
      isPrescribed: true,
      image: "/medicines/8.jpg",
      dosage: "20mg, once daily"
    },
    {
      id: "med9",
      name: "Cetirizine",
      description: "Antihistamine for allergies",
      price: 9.99,
      isPrescribed: false,
      image: "/medicines/9.jpg",
      dosage: "10mg, once daily"
    },
    {
      id: "med10",
      name: "Sertraline",
      description: "Antidepressant medication",
      price: 18.99,
      isPrescribed: true,
      image: "/medicines/10.jpg",
      dosage: "50mg, once daily"
    },
    {
      id: "med11",
      name: "Amlodipine",
      description: "Blood pressure medication",
      price: 13.99,
      isPrescribed: true,
      image: "/medicines/11.jpg",
      dosage: "5mg, once daily"
    },
    {
      id: "med12",
      name: "Probiotic Complex",
      description: "Digestive health supplement",
      price: 21.99,
      isPrescribed: false,
      image: "/medicines/12.jpg",
      dosage: "1 capsule daily"
    }
  ];
  
  const addToCart = (id: string) => {
    setCart([...cart, id]);
    toast({
      title: "Added to cart",
      description: "The medicine has been added to your cart."
    });
  };
  
  const buyNow = (name: string) => {
    toast({
      title: "Purchase Successful",
      description: `You have successfully purchased ${name}.`,
      variant: "default"
    });
  };
  
  return (
    <Layout role="patient">
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Medicine Shop</h1>
          <div className="relative">
            <ShoppingCart className="text-gray-600" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </div>
        </header>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Prescribed Medicines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines
              .filter(med => med.isPrescribed)
              .map(medicine => (
                <Card key={medicine.id} className="overflow-hidden">
                  <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img 
                      src={medicine.image} 
                      alt={medicine.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{medicine.name}</h3>
                        <p className="text-sm text-gray-600">{medicine.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Dosage: {medicine.dosage}</p>
                        <p className="font-medium text-green-600 mt-2">${medicine.price.toFixed(2)}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <Check size={12} className="mr-1" />
                        Prescribed
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => addToCart(medicine.id)}
                        className="text-xs"
                      >
                        Add to Cart
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => buyNow(medicine.name)}
                        className="bg-green-500 hover:bg-green-600 text-xs"
                      >
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Other Medicines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines
              .filter(med => !med.isPrescribed)
              .map(medicine => (
                <Card key={medicine.id} className="overflow-hidden">
                  <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img 
                      src={medicine.image} 
                      alt={medicine.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div>
                      <h3 className="font-semibold">{medicine.name}</h3>
                      <p className="text-sm text-gray-600">{medicine.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Dosage: {medicine.dosage}</p>
                      <p className="font-medium text-green-600 mt-2">${medicine.price.toFixed(2)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => addToCart(medicine.id)}
                        className="text-xs"
                      >
                        Add to Cart
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => buyNow(medicine.name)}
                        className="bg-green-500 hover:bg-green-600 text-xs"
                      >
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;

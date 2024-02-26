"use client";
import { Button, InputField, Navbar } from "@/components";
import { post } from "@/config";
import { useAuthStore, useCartStore, useGeoApifyStore } from "@/states";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Checkout() {
  const router = useRouter();
  const { autocomplete, locations } = useGeoApifyStore() as any;
  const { cart, resetItems } = useCartStore() as any;
  const { user } = useAuthStore() as any;
  const [showResults, setShowResults] = useState(true);
  const [formData, setFormData] = useState({
    contactNumber: "",
    name: "",
    houseLotBlk: "",
    barangay: "",
    paymentMethod: "",
  });
  const [search, setsearch] = useState<any>();
  const [location, setlocation] = useState<any>();
  const [discountIdImage, setdiscountIdImage] = useState<null | string>(null);
  const [assembly, setassembly] = useState<boolean>(false);
  const [showDiscountImage, setShowDiscountImage] = useState(false); // Add this line

  const fileChange = async (event: any) => {
    const form = new FormData();
    form.append("image", event.target.files[0]);
    const { data } = await post<FormData>("upload/image", form);
    if (data.status == "success") {
      setdiscountIdImage(data.data[0]?.path ?? "");
    }
  };

  const handleChange = (event: any) => {
    const { name, value, checked } = event.target;
    if (name == "assembly") {
      setassembly(checked);
      return;
    }
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const createTransaction = async () => {
    const { data } = await post("transactions", {
      ...formData,
      assembly,
      deliveryLocation: location.properties.formatted,
      long: location.properties.lon,
      lat: location.properties.lat,
      to: user._id ?? "",
      items: cart,
      statuses: [
        {
          createdAt: new Date(),
          message: `${user.name} created order`,
        },
      ],
      discountIdImage: discountIdImage ? discountIdImage : null,
      type: "Delivery",
      priceType: "Retailer",
    });

    if (data.status == "success") {
      resetItems();
      router.push("/");
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      autocomplete(search);
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [search, autocomplete]);
  const handleResultClick = (result: any) => {
    setsearch(result.properties.formatted);
    setlocation(result);
    setShowResults(false);
  };
  return (

    <main className="">
      <Navbar />
      <div className="container mx-auto pl-44 pr-44 pt-16">
     
      <div className="bg-white rounded-lg shadow-xl p-24">
        <h4 className="flex justify-center items-center m-8 font-bold">Set Delivery</h4>

      <div className="relative mb-8 flex gap-2 justify-center items-center pr-32 pl-32">
          <input
            type="text"
            value={search}
            onChange={(e: any) => {
              setsearch(e.target.value);
              setShowResults(true); // Show results when typing
            }}
            className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {showResults && locations.length > 0 && (
            <div className="absolute top-full left-0 bg-white border border-gray-300 w-full mt-1 rounded-md shadow-md">
              {locations.map((result: any) => (
                <p
                  key={result.properties.formatted}
                  onClick={() => handleResultClick(result)}
                  className="cursor-pointer py-2 px-4 hover:bg-gray-100"
                >
                  {result.properties.formatted}
                </p>
              ))}
            </div>
          )}
        </div>
          <div className="flex gap-2 justify-center items-center">
            <InputField name="name" placeholder="Full Name" onChange={handleChange} />
 
  <InputField
    name="contactNumber"
    placeholder="Contact Number"
    onChange={handleChange}
  />
  
          </div>
          
          <div className="flex gap-2 justify-center items-center">
          <InputField
    name="houseLotBlk"
    placeholder="House | Lot | Blk."
    onChange={handleChange}
  />
      <InputField
        name="barangay"
        placeholder="Baranggay"
        onChange={handleChange}
      />
  
          </div>
          


    <div className="flex flex-col gap-3 justify-center items-center mx-auto p-10">
  <p className="text-xl font-bold">Choose Payment Method</p>
  <div className="flex items-center gap-3">
    <InputField
      type="radio"
      name="paymentMethod"
      value="COD"
      placeholder="Cash on Delivery"
      onChange={handleChange}
    />
    <InputField
      type="radio"
      name="paymentMethod"
      value="GCASH"
      placeholder="GCASH"
      onChange={handleChange}
    />
  </div>
</div>
<div className="flex flex-col gap-3 justify-center items-center mx-auto pb-10">
  <p className="text-xl font-bold">Needs to be assembled?</p>
  <div className="flex items-center gap-3">
    <InputField
      type="checkbox"
      name="assembly"
      placeholder="Yes"
      onChange={handleChange}
    />
  </div>
          </div>
          <div className="flex flex-col gap-3 justify-center items-center mx-auto p-10">
  <p
    className="text-xl font-bold cursor-pointer"
    onClick={() => setShowDiscountImage(!showDiscountImage)}
  >
    Avail Discount as PWD/Senior Citizen?
  </p>
  {showDiscountImage && (
    <div>
      {discountIdImage ? (
        <Image
          src={discountIdImage ?? ""}
          width={150}
          height={150}
          alt={discountIdImage ?? ""}
        ></Image>
      ) : null}
      <div className="col-span-2">
        <InputField
          type="file"
          placeholder="Choose Image"
          onChange={fileChange}
        />
      </div>
    </div>
  )}
</div>
      {/* {cart.map((e: any) => (
        <div key={e._id}>
          <p>Name: {e.name}</p>
          <p>Quantity: {e.quantity}</p>
          <Image src={e.image} width={250} height={250} alt={e.image}></Image>
        </div>
      ))} */}
          <div className="flex flex-col gap-3 justify-center items-center mx-auto p-10">
          <Button
        onClick={() => {
          createTransaction();
        }}
      >
        Order Now
          </Button>

          </div>
     
        </div>
      </div>
    </main>
  );
}
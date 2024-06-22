"use client";
import { RegisterSchema } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import CardWrapper from "./CardWrapper";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Calendar, CircleCheck, Folder, TagIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Country } from "country-state-city";
import { Input } from "../ui/input";
import Confetti from "react-confetti";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

type Inputs = z.infer<typeof RegisterSchema>;

const STEPS = [
  {
    id: "Step 1",
    name: "Intro",
    fields: ["experience"],
    header: "Let's get started. Which of these best describes you?",
  },
  {
    id: "Step 2",
    name: "Getting to know you",
    fields: ["productsToSell"],
    header: "What do you plan to sell first?",
  },
  {
    id: "Step 3",
    name: "Location",
    fields: [""],
    header: "Where will your business be located?",
  },
  { id: "Step 4", name: "Registration", header: "Create a lynxlink account" },
  { id: "Step 5", name: "Confirm email", header: "Welcome to lynxlink" },
];
const PRODUCTS_TO_SELL = [
  {
    id: 1,
    value: "Products I buy or make myself",
    icon: <TagIcon />,
  },
  {
    id: 2,
    value: "Digital products",
    icon: <Folder />,
  },
  {
    id: 3,
    value: "Services",
    icon: <Calendar />,
  },
  {
    id: 4,
    value: "I'll decide later",
  },
];
export default function RegisterForm() {
  const router = useRouter();
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;
  const [goingToSell, setGoingToSell] = useState<
    (typeof PRODUCTS_TO_SELL)[number][]
  >([]);
  const [country, setCountry] = useState("");
  const allCountries = Country.getAllCountries();
  const [pieces, setPieces] = useState(0);
  const { toast } = useToast();
  const [success, setSuccess] = useState("");

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: async ({ name, email, password }: Inputs) => {
      const response = await axios.post("/api/register", {
        name,
        email,
        password,
      });

      return response.data;
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      experience: "newby",
      productsToSell: [],
      businessLocation: "",
      name: "",
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    setValue("productsToSell", goingToSell);
    setValue("businessLocation", country);
  }, [goingToSell, country]);
  const processForm: SubmitHandler<Inputs> = (data) => {
    registerUser(data, {
      onError: (error) => {
        // setShowLoader(false);
        if (error instanceof AxiosError) {
          if (error.response?.status === 500) {
            toast({
              title: "Error",
              description: "Something went wrong. Please try again later.",
              variant: "destructive",
            });
          }
        }
      },
      onSuccess: ({ message }: { message: string }) => {
        setPieces(200);
        setTimeout(() => {
          setPieces(0);
        }, 3500);
        setSuccess(message);
        // setFinishedLoading(true);
        // setTimeout(() => {
        //   if (form.getValues("type") === "mcq") {
        //     router.push(`/play/mcq/${gameId}`);
        //   } else if (form.getValues("type") === "open_ended") {
        //     router.push(`/play/open-ended/${gameId}`);
        //   }
        // }, 2000);
      },
    });
    reset();
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    const fields = STEPS[currentStep].fields;
    const output = await trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (!output) return;

    if (currentStep < STEPS.length - 1) {
      if (currentStep === STEPS.length - 2) {
        await handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };
  watch();

  return (
    <MaxWidthWrapper className="m-5 md:min-h-[88vh] md:max-h-[88vh]">
      <CardWrapper headerLabel="" backButtonHref="" backButtonLabel="">
        <section className="bg-white flex flex-col justify-between overflow-hidden ">
          {/* steps */}
          <nav aria-label="Progress">
            <ul
              role="list"
              className="space-y-4 md:flex md:space-x-8 md:space-y-0"
            >
              {STEPS.map((step, index) => (
                <li key={step.name} className="md:flex-1">
                  {currentStep > index ? (
                    <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                      <span className="text-sm font-medium text-sky-600 transition-colors ">
                        {step.id}
                      </span>
                      <span className="text-sm font-medium">{step.name}</span>
                    </div>
                  ) : currentStep === index ? (
                    <div
                      className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                      aria-current="step"
                    >
                      <span className="text-sm font-medium text-sky-600">
                        {step.id}
                      </span>
                      <span className="text-sm font-medium">{step.name}</span>
                    </div>
                  ) : (
                    <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                      <span className="text-sm font-medium text-gray-500 transition-colors">
                        {step.id}
                      </span>
                      <span className="text-sm font-medium">{step.name}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Form */}
          <form className=" py-8" onSubmit={handleSubmit(processForm)}>
            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <h2 className="text-2xl  font-semibold leading-7 text-gray-900">
                  {STEPS[0].header}
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  We'll help you get set up based on your business needs.
                </p>
                <div>
                  <div className="flex justify-between items-center my-10 w-full sm:w-2/3 mx-auto">
                    <Button
                      variant={
                        getValues("experience") === "newby"
                          ? "default"
                          : "outline"
                      }
                      className="w-1/2 rounded-none rounded-l-lg py-8"
                      onClick={() => {
                        setValue("experience", "newby");
                      }}
                      type="button"
                    >
                      I'm just starting
                    </Button>
                    <Separator orientation="vertical" />
                    <Button
                      variant={
                        getValues("experience") === "veteran"
                          ? "default"
                          : "outline"
                      }
                      className="w-1/2 rounded-none rounded-r-lg py-8"
                      onClick={() => {
                        setValue("experience", "veteran");
                      }}
                      type="button"
                    >
                      I'm already selling
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                  {STEPS[1].header}
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Pick what you want to start with. We'll help you stock your
                  store.
                </p>
                <div className="p-5 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {PRODUCTS_TO_SELL.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-2 items-center mt-5 border py-5 pr-8 pl-3 rounded-md hover:bg-gray-50"
                    >
                      <Checkbox
                        id={`productsToSell-${index}.id`}
                        name={`productsToSell-${index}.value`}
                        onCheckedChange={(checked) => {
                          setGoingToSell((prev) =>
                            checked
                              ? [...prev, PRODUCTS_TO_SELL[index]]
                              : prev.filter(
                                  (product) =>
                                    product.id !== PRODUCTS_TO_SELL[index].id
                                )
                          );
                        }}
                      />
                      <Label
                        htmlFor={`productsToSell-${index}.id`}
                        className="flex items-center justify-between w-full cursor-pointer"
                      >
                        {item.value} {item.icon}
                      </Label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <>
                <h2 className="text-2xl  font-semibold leading-7 text-gray-900">
                  {STEPS[2].header}
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  We'll use your location to set up your default shipping rates,
                  recommended apps, and more.
                </p>
                <div className="mt-6 p-2">
                  <Select
                    onValueChange={(value) => setCountry(value)}
                    // value={field.value}
                    // defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue
                        // defaultValue={field.value}
                        placeholder="Select a country"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {allCountries.map((country) => {
                        return (
                          <SelectItem
                            key={country.isoCode}
                            value={country.isoCode}
                          >
                            {country.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {currentStep === 3 && (
              <>
                <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                  {STEPS[3].header}
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Last step before starting your free trial.
                </p>
                <div className="sm:col-span-3">
                  <Label
                    htmlFor="lastName"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Name
                  </Label>
                  <div className="mt-2">
                    <Input
                      type="text"
                      id="lastName"
                      {...register("name")}
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.name?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <Label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </Label>
                  <div className="mt-2">
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      autoComplete="email"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.email?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <Label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </Label>
                  <div className="mt-2">
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      autoComplete="password"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.password?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
            {currentStep === 4 && (
              <>
                {success && (
                  <div className="text-center text-4xl bg-green-200 w-fit p-3 text-bold text-green-600 rounded-lg mx-auto m-5 flex items-center gap-3">
                    <CircleCheck className="size-10" /> {success}
                  </div>
                )}
              </>
            )}
          </form>
        </section>
        {/* Navigation */}
        <div className="pt-5">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prev}
              disabled={currentStep === 0}
              className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              disabled={currentStep === STEPS.length - 1}
              className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </CardWrapper>
      <Confetti gravity={0.2} numberOfPieces={pieces} />
    </MaxWidthWrapper>
  );
}

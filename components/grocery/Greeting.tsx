import { demoCustomer } from "@/data/customer";

export default function Greeting() {
  return (
    <p className="text-sm text-zinc-500">
      Welcome back,{" "}
      <span className="font-medium text-zinc-700">{demoCustomer.name}</span>
    </p>
  );
}

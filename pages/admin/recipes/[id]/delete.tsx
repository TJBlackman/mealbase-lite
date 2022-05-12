import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  //
  console.log("getServerSideProps params:", context.params);
  return { props: {} };
};

export default function DeleteRecipePage() {
  const router = useRouter();
  console.log(router.query);
  return <p>delete</p>;
}

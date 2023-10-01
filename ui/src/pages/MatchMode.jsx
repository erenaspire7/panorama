import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useLoaderData } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MatchMode() {
  const { terms, definitions, flashcards } = useLoaderData();

  const [chosenTerm, setChosenTerm] = useState(null);
  const [chosenDefinition, setChosenDefinition] = useState(null);

  const [displayedTerms, setDisplayedTerms] = useState(terms);
  const [displayedDefinitions, setDisplayedDefinitions] = useState(definitions);

  const selectTerm = (index) => {
    chosenTerm == index ? setChosenTerm(null) : setChosenTerm(index);
  };

  const selectDefinition = (index) => {
    chosenDefinition == index
      ? setChosenDefinition(null)
      : setChosenDefinition(index);
  };

  useEffect(() => {
    if (chosenTerm != null && chosenDefinition != null) {
      let card = flashcards.find(
        (el) => el["term"] == displayedTerms[chosenTerm]
      );

      console.log(card);

      let def = displayedDefinitions[chosenDefinition];

      if (card["definition"] == def) {
        setDisplayedTerms(
          displayedTerms.filter((el) => el != displayedTerms[chosenTerm])
        );
        setDisplayedDefinitions(
          displayedDefinitions.filter(
            (el) => el != displayedDefinitions[chosenDefinition]
          )
        );

        toast.success("Splendid Choice!", {
          theme: "colored",
          className: "text-sm",
        });
      } else {
        toast.error("Invalid Choice!", {
          theme: "colored",
          className: "text-sm",
        });
      }

      setChosenTerm(null);
      setChosenDefinition(null);

      // If Both are good navigate to a success screen, which navigates back to topic
    }
  }, [chosenTerm, chosenDefinition]);

return (
    <Layout>
      <div className="w-full py-10 px-20 flex">
        <div className="w-1/3 text-center mr-4">
          <p className="mb-4">Terms</p>

          <div className="grid grid-cols-2 gap-4">
            {displayedTerms.map((el, index) => (
              <div
                className="transition ease-in relative cursor-pointer duration-300"
                onClick={() => selectTerm(index)}
              >
                <div
                  className={`h-full flex items-center justify-center ${
                    chosenTerm == index
                      ? "bg-emerald-700 text-white"
                      : "bg-white"
                  } border-2 border-black p-4 relative z-50 hover:text-white hover:bg-emerald-500`}
                >
                  <p>{el}</p>
                </div>
                <div
                  className={` bg-black w-full h-full absolute top-1 left-1 z-0`}
                ></div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-2/3 text-center">
          <p className="mb-4">Definitions</p>

          <div className="grid grid-cols-3 gap-4">
            {displayedDefinitions.map((el, index) => (
              <div
                className="transition ease-in relative cursor-pointer duration-300"
                onClick={() => selectDefinition(index)}
              >
                <div
                  className={`
                    h-full flex items-center justify-center ${
                      chosenDefinition == index
                        ? "bg-emerald-700 text-white"
                        : "bg-white"
                    } border-2 border-black p-4 relative z-50 hover:text-white hover:bg-emerald-500`}
                >
                  <p>{el}</p>
                </div>
                <div
                  className={` bg-black w-full h-full absolute top-1 left-1 z-0`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

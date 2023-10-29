import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import SuccessModal from "../components/SuccessModal";
import axiosInstance from "../utils/axios";

export default function Quiz() {
  const { questions } = useLoaderData();

  const navigate = useNavigate();
  const path = useLocation();
  const id = path.pathname.split("/")[2];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [scores, setScores] = useState(new Array(questions.length).fill(null));
  const [showScore, setShowScore] = useState(false);

  const [review, setReview] = useState({
    title: "",
    subtitle: "",
  });

  const handleAnswerSelect = (answerIndex) => {
    const newScores = [...scores];
    newScores[currentQuestion] = answerIndex;
    setScores(newScores);
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const handleQuizSubmit = () => {
    let score = calculateScore();

    axiosInstance
      .post("topic/save-default-quiz", {
        correctAnswers: score,
        totalQuestions: questions.length,
      })
      .catch(() => {});

    axiosInstance
      .post("topic/log-study", {
        topicId: id,
      })
      .catch(() => {});

    setShowScore(true);

    let percent = (score / questions.length) * 100;

    if (percent >= 90) {
      setReview({
        title: "🌟 Exceptional Mastery!",
        subtitle: `Grade: ${Math.round(
          percent
        )}%. You've demonstrated exceptional understanding of the material. Keep up the outstanding work!`,
      });
    } else if (percent >= 70) {
      setReview({
        title: "👍 Solid Proficiency!",
        subtitle: `Grade: ${Math.round(
          percent
        )}%. You have a solid grasp of the content. Keep refining your skills for even better results.`,
      });
    } else if (percent >= 50) {
      setReview({
        title: "✅ Satisfactory Performance!",
        subtitle: `Grade: ${Math.round(
          percent
        )}%. You've shown a satisfactory level of understanding. Continue to practice and improve.`,
      });
    } else {
      setReview({
        title: "🔴 Needs Improvement!",
        subtitle: `Grade: ${Math.round(
          percent
        )}%. There's room for improvement. Consider revisiting the material and seeking help if needed.`,
      });
    }
  };

  const calculateScore = () => {
    return scores.reduce((totalScore, answer, index) => {
      return answer === questions[index].answerIndex
        ? totalScore + 1
        : totalScore;
    }, 0);
  };

  return (
    <Layout>
      <div className="w-full py-10 px-20 flex flex-col items-center">
        <p className="text-3xl font-bold">Quiz.</p>
        <div className="mt-2 mb-6 flex items-center">
          <div className="mr-2">
            <Button
              icon={<ArrowLeftIcon className="h-3 w-3" />}
              onClick={() => navigate(`/topic/${id}`)}
            />
          </div>
          <span>|</span>
          <div className="ml-2 mr-3">
            <Button
              text="Write Mode"
              textSize="text-xs"
              onClick={() => navigate(`/topic/${id}/write`)}
            ></Button>
          </div>
          <span>|</span>
          <div className="ml-2 mr-3">
            <Button
              text="Match Mode"
              textSize="text-xs"
              onClick={() => navigate(`/topic/${id}/match`)}
            ></Button>
          </div>
          <span>|</span>
          <div className="ml-2">
            <Button
              text="Flashcards"
              textSize="text-xs"
              onClick={() => navigate(`/topic/${id}/match`)}
            ></Button>
          </div>
        </div>

        <div className="py-8 w-full">
          <div className="w-full space-y-8">
            <div className="relative z-0 w-full">
              <p>Question {currentQuestion + 1}</p>
              <p>
                {questions[currentQuestion].type == "default"
                  ? questions[currentQuestion].question
                  : questions[currentQuestion].definition}
              </p>
              <div className="py-8">
                <div className="grid grid-cols-2 gap-4">
                  {questions[currentQuestion].options.map(
                    (option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="transition ease-in relative cursor-pointer duration-300"
                        onClick={() => handleAnswerSelect(optionIndex)}
                      >
                        <div
                          className={`h-full flex items-center justify-center ${
                            selectedAnswer === optionIndex
                              ? "bg-teal-700 text-white"
                              : "bg-white"
                          } border-2 border-black p-4 relative z-50 hover:text-white hover:bg-teal-500`}
                        >
                          <p>{option}</p>
                        </div>
                        <div
                          className={`bg-black w-full h-full absolute top-1 left-1 z-0`}
                        ></div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between items-center">
            <div>
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className={`transition ease-in relative cursor-pointer duration-300 ${
                  currentQuestion === 0 ? "bg-gray-400" : "bg-white"
                } border-2 border-black p-4 relative z-0 hover:text-black hover:bg-gray-300`}
              >
                Previous
              </button>
            </div>
            <div>
              {currentQuestion === questions.length - 1 && (
                <button
                  onClick={handleQuizSubmit}
                  className={`transition ease-in relative cursor-pointer duration-300 bg-white border-2 border-black p-4 relative z-50 hover:text-black hover:bg-gray-300`}
                >
                  Submit
                </button>
              )}
            </div>
            <div>
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestion === questions.length - 1}
                className={`transition ease-in relative cursor-pointer duration-300 ${
                  currentQuestion === questions.length - 1
                    ? "bg-gray-400"
                    : "bg-white"
                } border-2 border-black p-4 relative z-0 hover:text-black hover:bg-gray-300`}
              >
                Next
              </button>
            </div>
          </div>

          {showScore && (
            <div className="text-center mt-6">
              <p>
                Your Score: {calculateScore()} out of {questions.length}
              </p>
            </div>
          )}
        </div>
      </div>
      <SuccessModal
        show={showScore}
        setShow={setShowScore}
        title={`${review.title}`}
        subtitle={`${review.subtitle}`}
      />
    </Layout>
  );
}

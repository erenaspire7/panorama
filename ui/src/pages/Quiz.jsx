import { useLoaderData } from "react-router-dom";
import Layout from "../components/Layout";
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Quiz() {
  const { questions } = useLoaderData();

  if (!questions || questions.length === 0) {
    return <div>Loading or no questions available...</div>;
  }

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [scores, setScores] = useState(new Array(questions.length).fill(null));
  const [showScore, setShowScore] = useState(false);

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
  }

  const handleQuizSubmit = () => {
    setShowScore(true);
  }

  const calculateScore = () => {
    return scores.reduce((totalScore, answer, index) => {
      return answer === questions[index].answerIndex ? totalScore + 1 : totalScore;
    }, 0);
  } 

  return (
    <Layout>
      <div className="w-full py-10 px-20">
        <p>Quiz</p>

        <div className="py-8">
          <div className="w-full space-y-8">
            <div className="relative z-0 w-full">
              <p>Question {currentQuestion + 1}</p>
              <p>{questions[currentQuestion].type == 'default'? questions[currentQuestion].question:questions[currentQuestion].definition}</p>
              <div className="py-8">
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="transition ease-in relative cursor-pointer duration-300"
                    onClick={() => handleAnswerSelect(optionIndex)}
                  >
                    <div
                      className={`h-full flex items-center justify-center ${
                        selectedAnswer === optionIndex
                          ? "bg-emerald-700 text-white"
                          : "bg-white"
                      } border-2 border-black p-4 relative z-50 hover:text-white hover:bg-emerald-500`}
                    >
                      <p>{option}</p>
                    </div>
                    <div
                      className={`bg-black w-full h-full absolute top-1 left-1 z-0`}
                    ></div>
                  </div>
                ))}
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
                } border-2 border-black p-4 relative z-50 hover:text-black hover:bg-gray-300`}
              >
                Previous
              </button>
            </div>
            <div>{currentQuestion === questions.length - 1 && (
                <button
                  onClick={handleQuizSubmit}
                  className={`transition ease-in relative cursor-pointer duration-300 bg-white border-2 border-black p-4 relative z-50 hover:text-black hover:bg-gray-300`}
                >
                  Submit
                </button>
              )}</div>
            <div>
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestion === questions.length - 1}
                className={`transition ease-in relative cursor-pointer duration-300 ${
                  currentQuestion === questions.length - 1 ? "bg-gray-400" : "bg-white"
                } border-2 border-black p-4 relative z-50 hover:text-black hover:bg-gray-300`}
              >
                Next
              </button>
              
            </div>
          </div>

          {showScore && (
            <div className="text-center mt-6">
              <p>Your Score: {calculateScore()} out of {questions.length}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="bg-gray-50 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">How to Play Yahtzee</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="px-6 py-4 space-y-6">
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Game Rules</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <span>Each category can only be used once per game</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <span>You must fill one category each turn, even if it scores 0 points</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <span>The game ends after all 13 categories are filled</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <span>Your final score includes the upper section bonus if earned</span>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Scoring Categories</h3>
              
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Upper Section</h4>
                <p className="text-sm text-gray-600 mb-2 italic">Score = sum of matching dice</p>
                <div className="grid grid-cols-2 gap-2 text-gray-700">
                  <div className="flex items-start">
                    <span className="font-semibold mr-2">Ones:</span>
                    <span>Sum of all 1s</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold mr-2">Twos:</span>
                    <span>Sum of all 2s</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold mr-2">Threes:</span>
                    <span>Sum of all 3s</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold mr-2">Fours:</span>
                    <span>Sum of all 4s</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold mr-2">Fives:</span>
                    <span>Sum of all 5s</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold mr-2">Sixes:</span>
                    <span>Sum of all 6s</span>
                  </div>
                </div>
                <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                  <span className="font-semibold text-blue-800">Bonus:</span>
                  <span className="text-gray-700 ml-2">35 points if upper section totals 63 or more</span>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Lower Section</h4>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-start">
                    <span className="font-semibold mr-2 min-w-[140px]">Three of a Kind:</span>
                    <span>At least 3 dice showing the same value (score = sum of all dice)</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold mr-2 min-w-[140px]">Four of a Kind:</span>
                    <span>At least 4 dice showing the same value (score = sum of all dice)</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold mr-2 min-w-[140px]">Full House:</span>
                    <span>3 of one value and 2 of another (25 points)</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold mr-2 min-w-[140px]">Small Straight:</span>
                    <span>4 sequential dice (30 points)</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold mr-2 min-w-[140px]">Large Straight:</span>
                    <span>5 sequential dice (40 points)</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold mr-2 min-w-[140px]">Yahtzee:</span>
                    <span>All 5 dice showing the same value (50 points)</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-semibold mr-2 min-w-[140px]">Chance:</span>
                    <span>Any combination (score = sum of all dice)</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-300">
                  <h5 className="font-semibold text-yellow-900 mb-1">Yahtzee Bonus</h5>
                  <p className="text-sm text-gray-700">
                    If you score a Yahtzee (50 points) and the Yahtzee category is already filled, 
                    you earn a 100-point bonus! You can then use this roll in any other available category, 
                    even if it scores zero points.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Got It!
            </button>
          </div>
        </div>
    </div>
  );
}

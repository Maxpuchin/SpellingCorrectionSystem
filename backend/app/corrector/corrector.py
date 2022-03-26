import string
from nltk.tokenize import word_tokenize

import difflib
import jamspell
import re

class Corrector:
    def __init__(self, path_to_corrector):
        self.corrector = jamspell.TSpellCorrector()
        self.corrector.LoadLangModel(path_to_corrector)

    def __words_to_string(self, words):
        # res = ""
        # allowed_punct = [",", ".", "?", "!"]

        # if len(words) == 0:
        #     return ""

        # if len(words) == 1:
        #     if words[0] not in allowed_punct:
        #         return words[0] + " "
        #     else:
        #         return words[0]
        

        # for word_index in range(len(words) - 1):
        #     if words[word_index] in allowed_punct:
        #         continue
        #     if words[word_index + 1] in allowed_punct:
        #         res += words[word_index] + words[word_index + 1]
        #         continue
        #     else:
        #         res += words[word_index] + " "

        # return res if res[-1] in allowed_punct or res[-1] == " " else res + " "

        return " ".join(words) + " "

    def get_difference_and_candidates(self, src_text):
        src_words = word_tokenize(src_text)
        sent_to_send_to_corrector = re.sub("[^а-яёА-ЯЁ.?!(),-]+", " ", src_text)
        trg_text = self.corrector.FixFragment(sent_to_send_to_corrector)
        trg_words = word_tokenize(trg_text)

        sm = difflib.SequenceMatcher(None, src_words, trg_words)

        matching_blocks = list(sm.get_matching_blocks())

        correct_ranges = []
        for correct_block in matching_blocks:
            if correct_block.size == 0:
                continue

            l_src, r_src = correct_block.a, correct_block.a + correct_block.size
            l_trg, r_trg = correct_block.b, correct_block.b + correct_block.size

            correct_ranges.append(((l_src, r_src), (l_trg, r_trg)))

        if len(correct_ranges) == 0:
            return [
                {
                    "before": src_text,
                    "after": trg_text
                }
            ]

        incorrect_ranges = []

        first_range = correct_ranges[0]

        if first_range[0][0] == 0:
            if first_range[1][0] == 0:
                pass
            else:
                incorrect_ranges.append(((0, 0), (0, first_range[1][0])))
        else:
            if first_range[1][0] == 0:
                incorrect_ranges.append(((0, first_range[0][0]), (0, 0)))
            else:
                incorrect_ranges.append(((0, first_range[0][0]), (0, first_range[1][0])))
            
        for range_index in range(len(correct_ranges) - 1):
            cur_range = correct_ranges[range_index]
            next_range = correct_ranges[range_index + 1]

            incorrect_ranges.append(((cur_range[0][1], next_range[0][0]), (cur_range[1][1], next_range[1][0])))
        
        last_range = correct_ranges[-1]

        if last_range[0][1] == len(src_words):
            if last_range[1][1] == len(trg_words):
                pass
            else:
                incorrect_ranges.append(((len(src_words), len(src_words)), (last_range[1][1], len(trg_words))))
        else:
            if last_range[1][1] == len(trg_words):
                incorrect_ranges.append(((last_range[0][1], len(src_words)), (len(trg_words), len(trg_words))))
            else:
                incorrect_ranges.append(((last_range[0][1], len(src_words)), (last_range[1][1], len(trg_words))))

        sequence_to_send = []   

        for ((l_src, r_src), (l_trg, r_trg)) in incorrect_ranges:
            sequence_to_send.append((l_src, {
                "before": self.__words_to_string(src_words[l_src: r_src]),
                "after": self.__words_to_string(trg_words[l_trg: r_trg])
            }))

        for ((l_src, r_src), (l_trg, r_trg)) in correct_ranges:
            for index_src, index_trg in zip(range(l_src, r_src), range(l_trg, r_trg)):
                sequence_to_send.append(
                    (index_src, {
                        "before": src_words[index_src] + " ",
                        "after": trg_words[index_trg] + " "
                    })
                )


        response = []
        
        for (_, dct) in sorted(sequence_to_send):
            response.append(dct)

        return response

# corrector = Corrector()

# test_sentence = 'assd Как быть с праблемой любови в рамане sads Льва Толстово? Чтонибудь про дабро?'
# test_sentence1 = "Рассия"
# test_sentence2 = ""
# test_sentence3 = "Роман"

# print(corrector.get_difference_and_candidates(test_sentence))
# print(corrector.get_difference_and_candidates(test_sentence1))
# print(corrector.get_difference_and_candidates(test_sentence2))
# print(corrector.get_difference_and_candidates(test_sentence3))
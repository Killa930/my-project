<?php

namespace App\Helpers;

/*
 * ProfanityFilter — фильтр нецензурной лексики
 *
 * Заменяет плохие слова на звёздочки с сохранением первой и последней буквы.
 * Например: "дурак" → "д***к", "idiots" → "i****s"
 *
 * Использование:
 *   ProfanityFilter::clean("Ты дурак")  →  "Ты д***к"
 */
class ProfanityFilter
{
    // Список плохих слов (LV + RU + EN)
    // Храним в нижнем регистре, сравниваем без учёта регистра
    private static array $badWords = [
        // Латышский
        'idiots', 'muļķis', 'muļķe', 'stulbs', 'stulba', 'mēsls', 'sūds',
        'velns', 'krants', 'ķezā', 'pediķis',

        // Русский
        'дурак', 'дура', 'идиот', 'идиотка', 'мудак', 'козёл', 'козел',
        'тупой', 'тупая', 'чмо', 'урод', 'сволочь', 'гад', 'гадина',
        'блин', 'чёрт', 'черт', 'задолбал', 'бесит', 'паршивый',

        // Английский
        'idiot', 'stupid', 'fool', 'moron', 'dumb', 'jerk', 'loser',
        'crap', 'damn', 'hell', 'shit', 'fuck', 'bitch', 'ass',
        'bastard', 'retard',
    ];

    /*
     * Заменяет плохие слова на звёздочки
     * "дурак" → "д***к" (первая и последняя буква видны)
     */
    public static function clean(?string $text): ?string
    {
        if (!$text) return $text;

        foreach (self::$badWords as $word) {
            // Регулярка: ищем слово с границами \b (чтобы "class" не поймал "ass")
            // i — без учёта регистра, u — unicode (для кириллицы)
            $pattern = '/\b(' . preg_quote($word, '/') . ')\b/iu';

            $text = preg_replace_callback($pattern, function ($match) {
                return self::maskWord($match[0]);
            }, $text);
        }

        return $text;
    }

    /*
     * Маскирует слово: первая буква + звёздочки + последняя буква
     * "дурак" → "д***к"
     * "fuck" → "f**k"
     * "ab" → "**"
     */
    private static function maskWord(string $word): string
    {
        // Для unicode используем mb_функции
        $length = mb_strlen($word);

        if ($length <= 2) {
            return str_repeat('*', $length);
        }

        $first = mb_substr($word, 0, 1);
        $last = mb_substr($word, -1);
        $stars = str_repeat('*', $length - 2);

        return $first . $stars . $last;
    }

    /*
     * Проверяет содержит ли текст плохие слова
     */
    public static function contains(?string $text): bool
    {
        if (!$text) return false;

        foreach (self::$badWords as $word) {
            if (preg_match('/\b' . preg_quote($word, '/') . '\b/iu', $text)) {
                return true;
            }
        }

        return false;
    }
}

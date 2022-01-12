<?php
/**
 * This just generates some random title.
 *
 * Originally meant for my react-redux tutorial.
 */

function pickByRandom($dictionary): string {
    return $dictionary[array_rand($dictionary)];
}

function getScriptParam(string $name, $defaultValue = null) {
    $val = $_SERVER['REQUEST_METHOD'] === 'POST' ? $_POST[$name] : $_GET[$name];

    if ($val) {
        return preg_replace('/[^\p{L}\p{N}]/u', ' ', $val);
    }

    return $defaultValue;
}

function generateTitle(?string $prefix): string {
    $dictionary = [
            ['Rincewind', 'Lukeas Lus', 'Bilbo', 'Duncan', 'Hari', 'Zaphod', 'Kvothe', 'Joshua'],
            ['of', 'with', 'on', 'under', 'and the'],
            ['Frozen', 'Flame', 'Lame', 'Leafy', 'Dusty', 'Magic', 'Stone', 'Wooden'],
            ['River', 'Moon', 'Book', 'Wand', 'Boulder', 'Goblet', 'Pen', 'Knife', 'Fork', 'Stepper']
    ];

    $titleArr = [$prefix ?: pickByRandom($dictionary[0])];

    for ($i = 1; $i < count($dictionary); ++$i) {
        $titleArr[] = pickByRandom($dictionary[$i]);
    }

    return implode(' ', $titleArr);
}

function sendResponse(string $title, int $sleep): void {
    sleep($sleep);
    header('Content-Type: application/json');
    echo json_encode(['title' => $title]);
}

$prefix = getScriptParam('prefix');
$sleep = (int)getScriptParam('sleep', 3);

sendResponse(generateTitle($prefix), $sleep);

<?php
/**
 * This just generates some random title.
 *
 * Originally meant for my react-redux tutorial.
 */

$dictionary = [
        ['Rincewind', 'Lukeas Lus', 'Bilbo', 'Duncan', 'Hari', 'Zaphod', 'Kvothe'],
        ['of', 'with', 'on', 'under', 'and'],
        ['Frozen', 'Flame', 'Lame', 'Leafy', 'Dusty', 'Magic', 'Stone'],
        ['River', 'Moon', 'Book', 'Wand', 'Boulder', 'Goblet', 'Pen', 'Knife', 'Fork']
];

function pickByRandom($dictionary) {
    return $dictionary[array_rand($dictionary)];
}

$titleArr = [];

if (($_POST && $_POST['prefix'])) {
    array_push($titleArr, preg_replace('/[^\p{L}\p{N}]/u', ' ', $_POST['prefix']));
}
else {
    array_push($titleArr, pickByRandom($dictionary[0]));
}

for ($i = 1; $i < count($dictionary); ++$i) {
    array_push($titleArr, pickByRandom($dictionary[$i]));
}

echo json_encode(['title' => implode(' ', $titleArr)]);


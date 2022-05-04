<?php
/**
 * Deeplink tester.
 *
 * Tool that allows me to easily test one of projects I participate.
 */

$projectUid = array_key_exists('p', $_GET) ? urlencode(htmlspecialchars($_GET['p'])) : 'SOME_PROJECT_UID';

$domains = ['qa', 'cloud9', 'cloud', 'us.cloud'];
$selectedDomain = array_key_exists('c', $_GET) && in_array($_GET['c'], $domains) ? $_GET['c'] : $domains[0];
$baseUrl = "https://$selectedDomain.memsource.com/web";

$paths = [
    '/myProfile/index',
    '/project/list',
    '/project2/show/' . $projectUid,
    '/project/create',
    '/job2/create/' . $projectUid
];

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Deep link test</title>
    <meta name="robots" content="noindex, nofollow"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="stylesheet" href="/css/main.css"/>
</head>
<body>
<main>
    <section class="basic">
        <div class="container">
            <h1>Deep link test</h1>

            <form method="get" action="<?php echo $_SERVER['REQUEST_URI'] ?>">
                <div>
                    <label for="project_uid">Project UID:</label>
                    <input name="p" type="text" value="<?php echo $projectUid ?>" id="project_uid" width="100"/>
                </div>
                <div>
                    <label for="domain">Domain:</label>
                    <select name="c" id="domain">
                        <?php foreach ($domains as $domain): ?>
                            <option value="<?php echo $domain ?>"
                                    <?php if ($domain === $selectedDomain): echo 'selected="selected"'; endif; ?>
                            ><?php echo "$domain.memsource.com" ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <input type="submit" value="Set"  class="button-primary"/>
            </form>

            <h2><?php echo $selectedDomain ?></h2>
            <p><?php echo $baseUrl ?></p>
            <ul>
                <?php foreach ($paths as $path): ?>
                    <li><a href="<?php print $baseUrl . $path ?>"><?php print $path ?></a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </section>
</main>
</body>
</html>

<?php
/**
 * Deeplink tester.
 *
 * Tool that allows me to easily test one of my projects.
 */

$projectUid = $_GET['p'] ? urlencode(htmlspecialchars($_GET['p'])) : 'SOME_PROJECT_UID';
$domains = ['qa', 'cloud9', 'cloud', 'us.cloud'];
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
    <meta name="robots" content="noindex nofollow">
</head>
<body>
<h1>Deep link tests</h1>
<p>If you want to specify project UID you can do it by specifying "p" PATH parameter.</p>
<?php foreach ($domains as $domain): ?>
    <h2><?php print $domain ?></h2>
    <ul>
        <?php foreach ($paths as $path): ?>
            <?php $url = "https://$domain.memsource.com/web$path"; ?>
            <li><a href="<?php print $url ?>"><?php print $url ?></a></li>
        <?php endforeach; ?>
    </ul>
<?php endforeach; ?>
</body>
</html>

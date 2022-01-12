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
    <meta name="robots" content="noindex, nofollow"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body>
<h1>Deep link tests</h1>

<form method="get" action="<?php echo $_SERVER['REQUEST_URI'] ?>">
    <label for="project_uid">Project UID:</label>
    <input name="p" type="text" value="<?php echo $projectUid ?>" id="project_uid" width="100"/>
    <input type="submit" value="Set"/>
</form>

<?php
foreach ($domains as $domain):
    $baseUrl = "https://$domain.memsource.com/web";
?>
    <h2><?php echo $domain ?></h2>
    <p><?php echo $baseUrl ?></p>
    <ul>
        <?php foreach ($paths as $path): ?>
            <li><a href="<?php print $baseUrl . $path ?>"><?php print $path ?></a></li>
        <?php endforeach; ?>
    </ul>
<?php endforeach; ?>
</body>
</html>

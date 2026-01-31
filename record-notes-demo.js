const { chromium } = require('playwright');

async function recordNotesDemo() {
  console.log('🎬 Starting video recording...');

  // Launch browser with video recording enabled
  const browser = await chromium.launch({
    headless: false, // Show the browser for better recording
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: './videos',
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  try {
    console.log('📱 Navigating to the app...');
    // Navigate to your Next.js app (make sure it's running on port 3000)
    await page.goto('http://localhost:3000');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('🔍 Looking for Notes app...');
    // Wait for the Apps window to appear
    await page.waitForSelector('text=Notes', { timeout: 5000 });

    // Click on the Notes app icon/button
    await page.click('text=Notes');
    console.log('✅ Opened Notes app');

    // Wait for the Notes window to appear
    await page.waitForTimeout(1000);

    // Wait for the Notes app to be visible
    await page.waitForSelector('text=New note', { timeout: 5000 });
    await page.waitForTimeout(500);

    console.log('📝 Creating a new note...');
    // Click the "New note" button
    await page.click('text=New note');
    await page.waitForTimeout(500);

    // Find the editor (contenteditable div)
    const editor = await page.locator('[contenteditable="true"]').first();

    // Type some content
    console.log('⌨️  Typing content...');
    await editor.click();
    await page.waitForTimeout(300);

    // Type the title
    await editor.type('My first note', { delay: 100 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);

    // Type some body content
    await editor.type('This is a demo of creating a note in the Notes app.', { delay: 80 });
    await page.waitForTimeout(500);

    // Add another line
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    await editor.type('It works beautifully!', { delay: 80 });

    // Wait a bit to show the final result
    await page.waitForTimeout(2000);

    console.log('✨ Recording complete!');

  } catch (error) {
    console.error('❌ Error during recording:', error);
  } finally {
    // Close the context to save the video
    await context.close();
    await browser.close();

    console.log('💾 Video saved to ./videos directory');
  }
}

// Run the recording
recordNotesDemo().catch(console.error);

package com.frycold.lodgemate.app

import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.webkit.*
import android.widget.Button
import android.widget.LinearLayout
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class MainActivity : AppCompatActivity() {

  // The subdomain we own — any URL starting with this stays in the WebView
  private val OUR_HOST = "lodgemate.frycold.com"
  private val APP_URL = "https://lodgemate.frycold.com"

  private lateinit var webView: WebView
  private lateinit var swipeRefresh: SwipeRefreshLayout
  private lateinit var loadingScreen: LinearLayout
  private lateinit var noInternetScreen: LinearLayout
  private lateinit var retryButton: Button

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)

    // Bind views
    webView = findViewById(R.id.webView)
    swipeRefresh = findViewById(R.id.swipeRefresh)
    loadingScreen = findViewById(R.id.loadingScreen)
    noInternetScreen = findViewById(R.id.noInternetScreen)
    retryButton = findViewById(R.id.retryButton)

    // Retry button
    retryButton.setOnClickListener { attemptLoad() }

    // Pull-to-refresh → hard reload from network, never from cache/history
    swipeRefresh.setOnRefreshListener {
      if (NetworkUtils.isInternetAvailable(this)) {
        hardReload()
      } else {
        swipeRefresh.isRefreshing = false
        showNoInternet()
      }
    }

    // Configure WebView
    setupWebView()

    // First load
    attemptLoad()
  }

  private fun setupWebView() {
    val settings: WebSettings = webView.settings

    // JavaScript must be enabled for Angular
    @Suppress("SetJavaScriptEnabled")
    settings.javaScriptEnabled = true

    // DOM Storage = localStorage support
    settings.domStorageEnabled = true

    // Database storage (IndexedDB, Web SQL)
    settings.databaseEnabled = true

    // Allow cookies (including session cookies)
    val cookieManager = CookieManager.getInstance()
    cookieManager.setAcceptCookie(true)
    cookieManager.setAcceptThirdPartyCookies(webView, true)

    // Other useful settings for an Angular SPA
    settings.loadWithOverviewMode = true
    settings.useWideViewPort = true
    settings.setSupportZoom(false)
    settings.builtInZoomControls = false
    settings.displayZoomControls = false

    // Never trust the cache — always go to network so Firebase deploys show up immediately
    settings.cacheMode = WebSettings.LOAD_NO_CACHE
    settings.mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW

    webView.webViewClient = object : WebViewClient() {

      override fun shouldOverrideUrlLoading(
        view: WebView,
        request: WebResourceRequest
      ): Boolean {
        val url = request.url.toString()
        val host = request.url.host ?: ""

        // If the URL is on our subdomain → load in WebView
        return if (host == OUR_HOST || host.endsWith(".$OUR_HOST")) {
          false // Let WebView handle it
        } else {
          // External URL → open in system browser
          val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
          startActivity(intent)
          true // We handled it
        }
      }

      override fun onPageStarted(view: WebView, url: String, favicon: Bitmap?) {
        super.onPageStarted(view, url, favicon)
        // Show loading screen, hide the web content
        showLoading()
      }

      override fun onPageFinished(view: WebView, url: String) {
        super.onPageFinished(view, url)
        // Flush cookies to persistent storage
        CookieManager.getInstance().flush()
        // Page is ready — show WebView, hide loading screen
        showWebView()
        swipeRefresh.isRefreshing = false
      }

      override fun onReceivedError(
        view: WebView,
        request: WebResourceRequest,
        error: WebResourceError
      ) {
        super.onReceivedError(view, request, error)
        // Only show error for the main frame (not sub-resources)
        if (request.isForMainFrame) {
          swipeRefresh.isRefreshing = false
          showNoInternet()
        }
      }
    }

    webView.webChromeClient = WebChromeClient()
  }

  private fun attemptLoad() {
    if (NetworkUtils.isInternetAvailable(this)) {
      showLoading()
      hardReload()
    } else {
      showNoInternet()
    }
  }

  /**
   * Forces a completely fresh load from the network:
   * - clears WebView's cache
   * - clears back/forward history
   * - cache-busts the URL so any CDN/browser caching on Firebase's side is bypassed too
   */
  private fun hardReload() {
    webView.clearCache(true)
    webView.clearHistory()
    webView.settings.cacheMode = WebSettings.LOAD_NO_CACHE

    val freshUrl = "$APP_URL?ts=${System.currentTimeMillis()}"
    webView.loadUrl(freshUrl)
  }

  // ─── UI State helpers ─────────────────────────────────────────────────────

  private fun showLoading() {
    loadingScreen.visibility = View.VISIBLE
    noInternetScreen.visibility = View.GONE
    webView.visibility = View.GONE
  }

  private fun showNoInternet() {
    noInternetScreen.visibility = View.VISIBLE
    loadingScreen.visibility = View.GONE
    webView.visibility = View.GONE
  }

  private fun showWebView() {
    webView.visibility = View.VISIBLE
    loadingScreen.visibility = View.GONE
    noInternetScreen.visibility = View.GONE
  }

  // ─── Back navigation ──────────────────────────────────────────────────────

  @Deprecated("Deprecated in Java")
  override fun onBackPressed() {
    if (webView.canGoBack()) {
      webView.goBack()
    } else {
      @Suppress("DEPRECATION")
      super.onBackPressed()
    }
  }

  // ─── Lifecycle: pause/resume WebView ──────────────────────────────────────

  override fun onResume() {
    super.onResume()
    webView.onResume()
    // When app comes back to foreground, check internet again
    if (!NetworkUtils.isInternetAvailable(this) &&
      webView.visibility == View.GONE
    ) {
      showNoInternet()
    }
  }

  override fun onPause() {
    super.onPause()
    webView.onPause()
    CookieManager.getInstance().flush()
  }

  override fun onDestroy() {
    webView.destroy()
    super.onDestroy()
  }
}

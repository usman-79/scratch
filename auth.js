const SUPABASE_URL = 'https://rqawxnlrkchvzozebsve.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxYXd4bmxya2NodnpvemVic3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTEwMTksImV4cCI6MjA4ODM4NzAxOX0.aoSz1BI_PQm6nIrAalZRb-3-b9kk5V_b1rvENCzY6To';

let _supabase = null;

function getSupabase() {
    if (!_supabase) {
        _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return _supabase;
}

// Wait for Supabase CDN to load, then run callback
function onSupabaseReady(cb) {
    if (window.supabase) {
        cb();
    } else {
        // Poll until loaded
        var interval = setInterval(function () {
            if (window.supabase) {
                clearInterval(interval);
                cb();
            }
        }, 50);
    }
}

// Auth guard — hides body, redirects if not logged in
function checkAuth() {
    document.addEventListener('DOMContentLoaded', function () {
        document.body.style.visibility = 'hidden';
    });
    onSupabaseReady(async function () {
        var sb = getSupabase();
        var result = await sb.auth.getSession();
        if (!result.data.session) {
            window.location.href = 'login.html';
        } else {
            // Show body once confirmed
            if (document.body) {
                document.body.style.visibility = 'visible';
            } else {
                document.addEventListener('DOMContentLoaded', function () {
                    document.body.style.visibility = 'visible';
                });
            }
        }
    });
}

// Logout — always available as a global function
function logout() {
    onSupabaseReady(async function () {
        var sb = getSupabase();
        await sb.auth.signOut();
        window.location.href = 'login.html';
    });
}

// Login page logic
function initLoginPage() {
    var form = document.getElementById('auth-form');
    var emailInput = document.getElementById('auth-email');
    var passwordInput = document.getElementById('auth-password');
    var submitBtn = document.getElementById('auth-submit');
    var toggleLink = document.getElementById('auth-toggle');
    var formTitle = document.getElementById('auth-title');
    var errorMsg = document.getElementById('auth-error');
    var successMsg = document.getElementById('auth-success');

    if (!form) return;

    var isLogin = true;

    toggleLink.addEventListener('click', function (e) {
        e.preventDefault();
        isLogin = !isLogin;
        formTitle.textContent = isLogin ? 'Welcome Back' : 'Create Account';
        submitBtn.textContent = isLogin ? 'Log In' : 'Sign Up';
        toggleLink.textContent = isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in';
        errorMsg.textContent = '';
        successMsg.textContent = '';
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        errorMsg.textContent = '';
        successMsg.textContent = '';
        submitBtn.disabled = true;
        submitBtn.textContent = isLogin ? 'Logging in...' : 'Signing up...';

        var email = emailInput.value.trim();
        var password = passwordInput.value;
        var sb = getSupabase();

        if (isLogin) {
            var res = await sb.auth.signInWithPassword({ email: email, password: password });
            if (res.error) {
                errorMsg.textContent = res.error.message;
                submitBtn.disabled = false;
                submitBtn.textContent = 'Log In';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            var res = await sb.auth.signUp({ email: email, password: password });
            if (res.error) {
                errorMsg.textContent = res.error.message;
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign Up';
            } else {
                successMsg.textContent = 'Check your email for a confirmation link!';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign Up';
            }
        }
    });
}

// Redirect to index if already logged in (for login page)
function redirectIfLoggedIn() {
    onSupabaseReady(async function () {
        var sb = getSupabase();
        var result = await sb.auth.getSession();
        if (result.data.session) {
            window.location.href = 'index.html';
        }
    });
}

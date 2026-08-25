    </main>

    <!-- Floating Action Buttons -->
    <div style="position: fixed; bottom: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 1000;">
        <button class="btn btn-light rounded-circle shadow-sm" style="width: 50px; height: 50px;" type="button" aria-label="Accessibility">
            <i class="bi bi-universal-access-circle" style="font-size: 1.5rem; color: var(--accent-blue);"></i>
        </button>
        <button class="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center" style="width: 50px; height: 50px; position: relative;" type="button">
            <span style="position: absolute; right: 100%; margin-right: 10px; background: white; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; box-shadow: var(--glass-shadow);">Urja</span>
            <i class="bi bi-robot" style="font-size: 1.5rem; color: var(--accent-red);"></i>
        </button>
    </div>

    <footer>
        <div class="container site-width">
            <div class="row g-4 justify-content-between">
                <div class="col-lg-3 footer-col">
                    <div class="brand-lockup mb-4">
                        <div class="brand-mark" style="width: 40px; height: 40px; font-size: 1.2rem;">
                            <span class="bolt">M</span>
                        </div>
                        <div>
                            <div class="brand-name" style="font-size: 1rem;">MAHAVITARAN</div>
                        </div>
                    </div>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">
                        Local educational mockup inspired by public MSEDCL page structure. Not official.
                    </p>
                    <div class="d-flex gap-3 mt-3">
                        <a href="#" style="color: var(--accent-blue); font-size: 1.2rem;"><i class="bi bi-facebook"></i></a>
                        <a href="#" style="color: var(--accent-blue); font-size: 1.2rem;"><i class="bi bi-youtube"></i></a>
                        <a href="#" style="color: var(--text-main); font-size: 1.2rem;"><i class="bi bi-twitter-x"></i></a>
                        <a href="#" style="color: var(--accent-red); font-size: 1.2rem;"><i class="bi bi-instagram"></i></a>
                    </div>
                </div>

                <div class="col-lg-2 footer-col">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="about.php">About Us</a></li>
                        <li><a href="search.php?q=career">Career</a></li>
                        <li><a href="search.php?q=media">Media/Press</a></li>
                        <li><a href="policies.php">Policies</a></li>
                    </ul>
                </div>

                <div class="col-lg-2 footer-col">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="search.php?q=help">Help Center</a></li>
                        <li><a href="search.php?q=feedback">Feedback</a></li>
                        <li><a href="rti.php">RTI</a></li>
                        <li><a href="about.php">Contact us</a></li>
                    </ul>
                </div>

                <div class="col-lg-3 footer-col">
                    <h4>Contact Info</h4>
                    <ul style="color: var(--text-muted); font-size: 0.9rem;">
                        <li><i class="bi bi-geo-alt me-2 text-primary"></i> Hongkong Bank Building, M.G. Road, Fort, Mumbai-400001.</li>
                        <li><i class="bi bi-building me-2 text-primary"></i> Prakashgad, Bandra (E), Mumbai-400051</li>
                    </ul>
                    <div class="mt-3 p-3 glass-panel text-center">
                        <span style="font-size: 0.8rem; color: var(--text-muted);">Today's Visitors</span>
                        <div style="font-size: 1.2rem; font-weight: bold; letter-spacing: 2px;">2589</div>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                &copy; <?php echo date('Y'); ?> Mahavitaran Demo Project. All rights reserved. | Last Updated: July 21, 2026
            </div>
        </div>
    </footer>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        $(document).ready(function () {
            $('#units').on('input', function () {
                $('#liveUnits').text($(this).val() || '0');
            });

            $('.reload-btn').on('click', function () {
                $('.fake-captcha').text('5p7');
            });
        });
    </script>
</body>
</html>

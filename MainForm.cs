using System.Net.Http;
using Newtonsoft.Json.Linq;

namespace CurrencyConverter;

public partial class MainForm : Form
{
    private static readonly HttpClient client = new HttpClient();
    private static readonly string BASE_URL = "https://api.exchangerate-api.com/v4/latest/";
    private readonly ComboBox fromCurrencyComboBox;
    private readonly ComboBox toCurrencyComboBox;
    private readonly TextBox amountTextBox;
    private readonly Button convertButton;
    private readonly Label resultLabel;
    private bool isDarkTheme = false;
    private bool isEnglish = false;

    // Локализованные строки
    private readonly Dictionary<string, string[]> localizedStrings = new()
    {
        ["title"] = new[] { "Конвертер валют", "Currency Converter" },
        ["amount"] = new[] { "Сумма:", "Amount:" },
        ["from"] = new[] { "Из валюты:", "From:" },
        ["to"] = new[] { "В валюту:", "To:" },
        ["convert"] = new[] { "Конвертировать", "Convert" },
        ["loading"] = new[] { "Загрузка...", "Loading..." },
        ["error"] = new[] { "Ошибка", "Error" },
        ["errorMessage"] = new[] { "Пожалуйста, введите корректную сумму! Используйте точку или запятую как разделитель.", 
                                 "Please enter a valid amount! Use dot or comma as decimal separator." },
        ["errorCurrency"] = new[] { "Ошибка получения курса валют!", "Error getting exchange rate!" },
        ["errorOccurred"] = new[] { "Произошла ошибка", "An error occurred" }
    };

    // Цветовые схемы
    private readonly Color[] lightTheme = {
        Color.FromArgb(240, 240, 240), // фон
        Color.FromArgb(51, 51, 51),    // текст
        Color.White,                    // поля ввода
        Color.FromArgb(0, 120, 212),   // акцент
        Color.FromArgb(0, 100, 180)    // акцент при наведении
    };

    private readonly Color[] darkTheme = {
        Color.FromArgb(32, 32, 32),    // фон
        Color.FromArgb(240, 240, 240), // текст
        Color.FromArgb(50, 50, 50),    // поля ввода
        Color.FromArgb(0, 120, 212),   // акцент
        Color.FromArgb(0, 100, 180)    // акцент при наведении
    };

    public MainForm()
    {
        // Базовые настройки формы
        this.Text = GetLocalizedString("title");
        this.Size = new Size(460, 430);
        this.FormBorderStyle = FormBorderStyle.FixedSingle;
        this.MaximizeBox = false;
        this.StartPosition = FormStartPosition.CenterScreen;
        this.Font = new Font("Segoe UI", 10F, FontStyle.Regular);
        
        // Инициализация элементов
        fromCurrencyComboBox = new ComboBox();
        toCurrencyComboBox = new ComboBox();
        amountTextBox = new TextBox();
        convertButton = new Button();
        resultLabel = new Label();
        
        // Очищаем содержимое формы
        this.Controls.Clear();
        
        // Создаем основную панель
        Panel mainPanel = new Panel
        {
            Dock = DockStyle.Fill,
            Padding = new Padding(20, 20, 20, 20)
        };
        
        // Заголовок
        Label titleLabel = new Label
        {
            Text = GetLocalizedString("title"),
            Font = new Font("Segoe UI", 16F, FontStyle.Bold),
            TextAlign = ContentAlignment.MiddleCenter,
            Dock = DockStyle.Top,
            Height = 40
        };
        
        // Кнопка переключения темы
        Button themeButton = new Button
        {
            Text = "🌙",
            FlatStyle = FlatStyle.Flat,
            Size = new Size(36, 30),
            Location = new Point(mainPanel.Width - 100, 5),
            Anchor = AnchorStyles.Top | AnchorStyles.Right
        };
        themeButton.FlatAppearance.BorderSize = 0;
        themeButton.Click += (s, e) => ToggleTheme(themeButton);

        // Кнопка переключения языка
        Button languageButton = new Button
        {
            Text = "🌐",
            FlatStyle = FlatStyle.Flat,
            Size = new Size(36, 30),
            Location = new Point(mainPanel.Width - 60, 5),
            Anchor = AnchorStyles.Top | AnchorStyles.Right
        };
        languageButton.FlatAppearance.BorderSize = 0;
        languageButton.Click += (s, e) => ToggleLanguage(languageButton, titleLabel);
        
        // Контейнер для содержимого (отцентрированный)
        Panel contentPanel = new Panel
        {
            Width = 300,
            Height = 240,
            Anchor = AnchorStyles.None,
            AutoSize = false
        };
        
        // Размещаем панель по центру, но немного выше
        contentPanel.Location = new Point(
            (mainPanel.ClientSize.Width - contentPanel.Width) / 2,
            35);

        // Обработчик изменения размера формы для поддержания центрирования
        this.SizeChanged += (s, e) => {
            contentPanel.Location = new Point(
                (mainPanel.ClientSize.Width - contentPanel.Width) / 2,
                35);
        };
        
        // Метки и поля ввода
        Label amountLabel = new Label
        {
            Text = GetLocalizedString("amount"),
            TextAlign = ContentAlignment.MiddleLeft,
            Location = new Point(0, 0),
            Size = new Size(90, 30)
        };
        
        amountTextBox.Location = new Point(100, 0);
        amountTextBox.Size = new Size(200, 30);
        amountTextBox.Font = new Font("Segoe UI", 12F);
        amountTextBox.BorderStyle = BorderStyle.FixedSingle;
        
        Label fromLabel = new Label
        {
            Text = GetLocalizedString("from"),
            TextAlign = ContentAlignment.MiddleLeft,
            Location = new Point(0, 35),
            Size = new Size(90, 30)
        };
        
        fromCurrencyComboBox.Location = new Point(100, 35);
        fromCurrencyComboBox.Size = new Size(200, 30);
        fromCurrencyComboBox.DropDownStyle = ComboBoxStyle.DropDownList;
        fromCurrencyComboBox.Font = new Font("Segoe UI", 12F);
        fromCurrencyComboBox.FlatStyle = FlatStyle.Flat;
        
        Label toLabel = new Label
        {
            Text = GetLocalizedString("to"),
            TextAlign = ContentAlignment.MiddleLeft,
            Location = new Point(0, 70),
            Size = new Size(90, 30)
        };
        
        toCurrencyComboBox.Location = new Point(100, 70);
        toCurrencyComboBox.Size = new Size(200, 30);
        toCurrencyComboBox.DropDownStyle = ComboBoxStyle.DropDownList;
        toCurrencyComboBox.Font = new Font("Segoe UI", 12F);
        toCurrencyComboBox.FlatStyle = FlatStyle.Flat;
        
        // Результат
        resultLabel.TextAlign = ContentAlignment.MiddleCenter;
        resultLabel.Font = new Font("Segoe UI", 14F, FontStyle.Bold);
        resultLabel.Size = new Size(300, 40);
        resultLabel.Location = new Point(0, 105);
        resultLabel.Text = "";
        
        // Кнопка конвертации
        convertButton.Text = GetLocalizedString("convert");
        convertButton.Font = new Font("Segoe UI", 12F);
        convertButton.ForeColor = Color.White;
        convertButton.BackColor = lightTheme[3];
        convertButton.FlatStyle = FlatStyle.Flat;
        convertButton.Size = new Size(200, 40);
        convertButton.Location = new Point(50, 150);
        convertButton.FlatAppearance.BorderSize = 0;
        convertButton.Click += async (sender, e) => await ConvertCurrencyAsync();
        
        // Добавляем валюты
        string[] currencies = { "USD", "EUR", "RUB", "BYN", "GBP", "JPY", "CNY", "CHF", "AUD", "CAD" };
        fromCurrencyComboBox.Items.AddRange(currencies);
        toCurrencyComboBox.Items.AddRange(currencies);
        
        // Значения по умолчанию
        fromCurrencyComboBox.SelectedItem = "USD";
        toCurrencyComboBox.SelectedItem = "EUR";
        
        // Добавляем все элементы
        contentPanel.Controls.Add(amountLabel);
        contentPanel.Controls.Add(amountTextBox);
        contentPanel.Controls.Add(fromLabel);
        contentPanel.Controls.Add(fromCurrencyComboBox);
        contentPanel.Controls.Add(toLabel);
        contentPanel.Controls.Add(toCurrencyComboBox);
        contentPanel.Controls.Add(resultLabel);
        contentPanel.Controls.Add(convertButton);
        
        mainPanel.Controls.Add(themeButton);
        mainPanel.Controls.Add(languageButton);
        mainPanel.Controls.Add(titleLabel);
        mainPanel.Controls.Add(contentPanel);
        
        // Добавляем главную панель на форму
        this.Controls.Add(mainPanel);
        
        // Применяем тему
        ApplyTheme(lightTheme);
    }

    private string GetLocalizedString(string key)
    {
        return localizedStrings[key][isEnglish ? 1 : 0];
    }

    private void ToggleLanguage(Button languageButton, Label titleLabel)
    {
        isEnglish = !isEnglish;
        languageButton.Text = isEnglish ? "🇷🇺" : "🌐";
        
        // Обновляем все тексты
        this.Text = GetLocalizedString("title");
        titleLabel.Text = GetLocalizedString("title");
        
        foreach (Control control in this.Controls)
        {
            UpdateControlText(control);
        }
    }

    private void UpdateControlText(Control control)
    {
        if (control is Label label)
        {
            if (label.Text == GetLocalizedString("amount")) label.Text = GetLocalizedString("amount");
            else if (label.Text == GetLocalizedString("from")) label.Text = GetLocalizedString("from");
            else if (label.Text == GetLocalizedString("to")) label.Text = GetLocalizedString("to");
        }
        else if (control is Button button && button == convertButton)
        {
            button.Text = GetLocalizedString("convert");
        }

        foreach (Control child in control.Controls)
        {
            UpdateControlText(child);
        }
    }

    private void ToggleTheme(Button themeButton)
    {
        isDarkTheme = !isDarkTheme;
        themeButton.Text = isDarkTheme ? "☀" : "🌙";
        ApplyTheme(isDarkTheme ? darkTheme : lightTheme);
    }

    private void ApplyTheme(Color[] theme)
    {
        this.BackColor = theme[0];
        
        foreach (Control control in this.Controls)
        {
            ApplyThemeToControl(control, theme);
        }

        convertButton.BackColor = theme[3];
        convertButton.MouseEnter += (s, e) => convertButton.BackColor = theme[4];
        convertButton.MouseLeave += (s, e) => convertButton.BackColor = theme[3];
    }

    private void ApplyThemeToControl(Control control, Color[] theme)
    {
        control.ForeColor = theme[1];
        control.BackColor = theme[0];

        if (control is TextBox || control is ComboBox)
        {
            control.BackColor = theme[2];
        }

        foreach (Control child in control.Controls)
        {
            ApplyThemeToControl(child, theme);
        }
    }

    private async Task ConvertCurrencyAsync()
    {
        try
        {
            string amountText = amountTextBox.Text.Replace('.', ',');
            
            if (!decimal.TryParse(amountText, out decimal amount))
            {
                MessageBox.Show(GetLocalizedString("errorMessage"), GetLocalizedString("error"), 
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            convertButton.Enabled = false;
            resultLabel.Text = GetLocalizedString("loading");

            string fromCurrency = fromCurrencyComboBox.SelectedItem.ToString()!;
            string toCurrency = toCurrencyComboBox.SelectedItem.ToString()!;

            string response = await client.GetStringAsync($"{BASE_URL}{fromCurrency}");
            JObject data = JObject.Parse(response);

            if (!data.ContainsKey("rates") || data["rates"][toCurrency] == null)
            {
                throw new Exception(GetLocalizedString("errorCurrency"));
            }

            decimal rate = data["rates"][toCurrency].Value<decimal>();
            decimal result = amount * rate;

            resultLabel.Text = $"{amount} {fromCurrency} = {result:F2} {toCurrency}";
        }
        catch (Exception ex)
        {
            MessageBox.Show($"{GetLocalizedString("error")}: {ex.Message}", GetLocalizedString("error"), 
                MessageBoxButtons.OK, MessageBoxIcon.Error);
            resultLabel.Text = GetLocalizedString("errorOccurred");
        }
        finally
        {
            convertButton.Enabled = true;
        }
    }
} 
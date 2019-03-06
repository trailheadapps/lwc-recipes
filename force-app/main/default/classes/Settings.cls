public class Settings {
@AuraEnabled public String message { get; set; }
@AuraEnabled public NotificationSettings apexChatterSettings { get; set; }
@AuraEnabled public NotificationSettings apexEmailSettings { get; set; }
}
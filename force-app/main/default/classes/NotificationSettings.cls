public class NotificationSettings {
@AuraEnabled public String type { get; set; }
@AuraEnabled public String recipient { get; set; }
@AuraEnabled public Boolean allCoverage { get; set; }
@AuraEnabled public Boolean coverageDrop { get; set; }
@AuraEnabled public Integer coverageDropThreshold { get; set; }
@AuraEnabled public Boolean coverageWarning { get; set; }
@AuraEnabled public Integer coverageWarningThreshold { get; set; }
@AuraEnabled public Boolean coverageFailure { get; set; }
@AuraEnabled public Boolean failingTest { get; set; }
}
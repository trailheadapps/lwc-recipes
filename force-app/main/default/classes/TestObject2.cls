public class TestObject2 {
    
    private static final Integer DEFAULT_SIZE = 10;
    
    Integer size;
    
    //Constructor with no arguments
    public TestObject2() {
        this(DEFAULT_SIZE); // Using this(...) calls the one argument constructor    
    }
    
    // Constructor with one argument 
    public TestObject2(Integer ObjectSize) {
        size = ObjectSize; 
        system.debug('test'+size);
    }
}